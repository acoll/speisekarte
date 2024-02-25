import { Module } from '@nestjs/common';
import { ScrapeRecipeHandler } from './handler';
import { ScraperProcessor } from './processor';

@Module({
  imports: [],
  providers: [ScraperProcessor, ScrapeRecipeHandler],
})
export class ScraperModule {}
