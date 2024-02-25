import { Data } from 'effect';

export class SaveRecipeCommand extends Data.Class<{
  url: string;
  recipeId: string;
}> {}
