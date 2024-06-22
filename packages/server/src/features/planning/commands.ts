import { Command } from '~/common/command';

export class PlanMealCommand extends Command<{
  scheduledForWeekOf: Date;
  recipeId: string;
}> {}
