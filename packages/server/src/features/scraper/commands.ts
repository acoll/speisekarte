import { Command } from '~/common/command';

export class ScrapeRecipeCommand extends Command<{
  recipeId: string;
  content: string;
}> {}
