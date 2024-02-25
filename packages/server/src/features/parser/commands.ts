import { Data } from 'effect';

export class ParseRecipeCommand extends Data.Class<{
  recipeId: string;
  ingredients: string[];
  instructions: string[];
  name: string;
}> {}
