import { Command } from '~/common/command';

export class SaveRecipeCommand extends Command<{
  url: string;
  recipeId: string;
}> {}
