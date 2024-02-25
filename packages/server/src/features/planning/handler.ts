import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { Eventstore } from '~/common/eventstore';
import { PlanMealCommand } from './commands';
import { PlannedMeals, RecipeReadModel } from './handler-models';

@CommandHandler(PlanMealCommand)
export class PlanMealHandler implements ICommandHandler<PlanMealCommand> {
  constructor(private readonly eventstore: Eventstore) {}
  async execute(command: PlanMealCommand) {
    const weekPlan = await this.eventstore.loadReadModel(
      new PlannedMeals(command.scheduledForWeekOf),
    );

    if (weekPlan.meals.size >= 7) {
      throw new Error('Week plan is full');
    }

    const { recipe } = await this.eventstore.loadReadModel(
      new RecipeReadModel(command.recipeId),
    );

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    await this.eventstore.appendEvent({
      type: 'meal-planned',
      mealId: randomUUID(),
      recipeId: command.recipeId,
      ingredients: recipe.ingredients,
      name: recipe.name,
      scheduledForWeekOf: command.scheduledForWeekOf,
      steps: recipe.steps,
    });
  }
}
