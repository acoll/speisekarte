import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { Eventstore } from '~/common/eventstore';
import { ScrapeRecipeCommand } from './commands';
import { RecipePagesToScrape } from './processor-models';

@Injectable()
export class ScraperProcessor {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventStore: Eventstore,
    private readonly commandBus: CommandBus,
  ) {}

  async process() {
    const { recipePagesToScrape } = await this.eventStore.loadReadModel(
      new RecipePagesToScrape(),
    );

    // do the actual scraping
    for (const recipe of recipePagesToScrape) {
      const { content, images } = await this.scrapeRecipe(recipe.url);
      await this.commandBus.execute(
        new ScrapeRecipeCommand({ recipeId: recipe.id, content, images }),
      );
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: ScraperProcessor.name })
  async handleCron() {
    const job = this.schedulerRegistry.getCronJob(ScraperProcessor.name);
    job.stop();

    try {
      await this.process();
    } catch (err) {
      console.log(err);
    }

    job.start();
  }

  private async scrapeRecipe(url: string) {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    // Open a new tab
    const page = await browser.newPage();

    // Visit the page and wait until network connections are completed
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Interact with the DOM to retrieve the titles
    const texts = await page.evaluate(() => {
      // Select all elements with crayons-tag class
      return Array.from(document.querySelectorAll('p'))
        .map((el) => el.textContent)
        .filter((str): str is Exclude<typeof str, null> => !!str);
    });

    const images = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map((img) => img.src);
    });

    // Don't forget to close the browser instance to clean up the memory
    await browser.close();

    return {
      content: texts.join('\n'),
      images,
    };
  }
}
