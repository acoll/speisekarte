import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ConsumerPersistenceAdapter,
  ConsumerProcessor,
} from '~/common/consumer';
import { EventRecord } from '~/common/event';
import { ScrapeRecipeCommand } from './commands';
import { PageScraper } from './puppeteer/page-scraper';

@Injectable()
export class ScraperProcessor extends ConsumerProcessor {
  private isProcessing = false;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly pageScraper: PageScraper,
    protected readonly adapter: ConsumerPersistenceAdapter,
  ) {
    super(ScraperProcessor.name, adapter);
  }

  @Cron(CronExpression.EVERY_SECOND, { name: ScraperProcessor.name })
  async process() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await super.process();

    this.isProcessing = false;
  }

  async consume(record: EventRecord) {
    const { event, tenantId } = record;

    if (event.type !== 'recipe-saved') {
      return;
    }

    try {
      const content = await this.pageScraper.scrapePage(event.url);
      const command = new ScrapeRecipeCommand(tenantId, {
        recipeId: event.recipeId,
        content,
      });
      await this.commandBus.execute(command);
    } catch (error) {
      console.error(error);
      // TODO: append events for error cases
    }
  }
}
