import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Eventstore } from '~/common/eventstore';
import { Processor } from '~/common/processor';
import { ScrapeRecipeCommand } from './commands';
import { RecipePagesToScrape } from './processor-models';
import { PageScraper } from './puppeteer/page-scraper';

@Injectable()
export class ScraperProcessor extends Processor {
  private isProcessing = false;

  constructor(
    private readonly eventStore: Eventstore,
    private readonly commandBus: CommandBus,
    private readonly pageScraper: PageScraper,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: ScraperProcessor.name })
  async process() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const { recipePagesToScrape } = await this.eventStore.loadReadModel(
        new RecipePagesToScrape(),
      );

      // do the actual scraping
      for (const recipe of recipePagesToScrape) {
        try {
          const content = await this.pageScraper.scrapePage(recipe.url);
          await this.commandBus.execute(
            new ScrapeRecipeCommand({ recipeId: recipe.id, content }),
          );
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }

    this.isProcessing = false;
  }
}
