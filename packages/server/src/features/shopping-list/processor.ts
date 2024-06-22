import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { difference } from 'lodash';
import { Eventstore } from '~/common/eventstore';
import { Processor } from '~/common/processor';
import { AggregateShoppingListCommand } from './commands';
import { ShoppingListAggregator } from './openai/shopping-list-aggregator';
import { PlannedMeals, ShoppingListMeals } from './processor-models';

@Injectable()
export class ShoppingListProcessor extends Processor {
  private isProcessing = false;

  constructor(
    private readonly eventstore: Eventstore,
    private readonly commandBus: CommandBus,
    private readonly shoppingListAggregator: ShoppingListAggregator,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: ShoppingListProcessor.name })
  async process() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const startOfNextWeek = dayjs().startOf('week').add(1, 'week').toDate();

      // get the current week plan meals
      const weekPlanMeals = await this.eventstore.loadReadModel(
        new PlannedMeals(startOfNextWeek),
      );

      // get the current shopping list's meals
      const shoppingListMeals = await this.eventstore.loadReadModel(
        new ShoppingListMeals(startOfNextWeek),
      );

      // if the shopping list's meals includes all the meals in the week plan, then we're good
      const weekPlanMealIds = Array.from(
        weekPlanMeals.meals.map((meal) => meal.id),
      );
      const shoppingListMealIds = Array.from(shoppingListMeals.meals);

      const diffMealIds = difference(weekPlanMealIds, shoppingListMealIds);

      if (diffMealIds.length === 0) {
        return;
      }

      // Compile all ingredients for all meals
      const ingredients = weekPlanMeals.meals.flatMap(
        (meal) => meal.ingredients,
      );

      // aggregate the ingredients
      const aggregatedItems =
        await this.shoppingListAggregator.aggregate(ingredients);

      // create a command to add the aggregated ingredients to the shopping list
      const command = new AggregateShoppingListCommand({
        items: aggregatedItems,
        mealIds: weekPlanMealIds,
        shoppingListForWeekOf: startOfNextWeek,
      });

      await this.commandBus.execute(command);
    } catch (err) {
      console.error(err);
    }

    this.isProcessing = false;
  }
}
