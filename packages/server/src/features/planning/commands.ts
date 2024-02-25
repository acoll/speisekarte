import { Data } from 'effect';

export class PlanMealCommand extends Data.Class<{
  scheduledForWeekOf: Date;
  recipeId: string;
}> {}
