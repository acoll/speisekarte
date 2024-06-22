import { Module } from '@nestjs/common';
import { ScrapeRecipeHandler } from './handler';
import { ScraperProcessor } from './processor';
import { PageScraper, PuppeteerPageScraper } from './puppeteer/page-scraper';

@Module({
  imports: [],
  providers: [
    ScraperProcessor,
    ScrapeRecipeHandler,
    {
      provide: PageScraper,
      useClass: PuppeteerPageScraper,
    },
  ],
})
export class ScraperModule {}
