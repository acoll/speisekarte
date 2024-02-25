import { Module } from '@nestjs/common';
import { OpenAIModule } from '~/openai/_module';
import { PersistenceModule } from '~/persistence/persistence.module';
import { ParseRecipeHandler } from './handler';
import {
  OpenAIRecipeImageGenerator,
  RecipeImageGenerator,
} from './openai/recipe-image-generator';
import { OpenAIRecipeParser, RecipeParser } from './openai/recipe-parser';
import { ParserProcessor } from './processor';

@Module({
  imports: [OpenAIModule, PersistenceModule],
  providers: [
    ParserProcessor,
    ParseRecipeHandler,
    {
      provide: RecipeParser,
      useClass: OpenAIRecipeParser, // Use MockRecipeParser for testing
    },
    {
      provide: RecipeImageGenerator,
      useClass: OpenAIRecipeImageGenerator, // Use MockRecipeImageGenerator for testing
    },
  ],
})
export class ParserModule {}
