import { Command } from '~/common/command';

export class ParseRecipeCommand extends Command<{
  recipeId: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}> {}
