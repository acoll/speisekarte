import { Data } from 'effect';

export class ScrapeRecipeCommand extends Data.Class<{
  recipeId: string;
  content: string;
  images: string[];
}> {}
