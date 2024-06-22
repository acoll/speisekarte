import { Data } from 'effect';

export class ParseRecipeCommand extends Data.Class<{
  recipeId: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}> {}
