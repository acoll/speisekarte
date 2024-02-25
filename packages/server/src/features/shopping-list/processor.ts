import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { difference } from 'lodash';
import OpenAI from 'openai';
import { z } from 'zod';
import { Eventstore } from '~/common/eventstore';
import { Processor } from '~/common/processor';
import { AggregateShoppingListCommand } from './commands';
import { PlannedMeals, ShoppingListMeals } from './processor-models';

@Injectable()
export class ShoppingListProcessor extends Processor {
  private openai: OpenAI;

  private parsedShoppingListSchema = z.object({
    items: z.array(
      z.object({
        name: z.string(),
        category: z.string(),
        quantity: z.string(),
      }),
    ),
  });

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventstore: Eventstore,
    private readonly commandBus: CommandBus,
  ) {
    super();
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async process() {
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
    const ingredients = weekPlanMeals.meals.flatMap((meal) => meal.ingredients);

    // aggregate the ingredients
    const aggregatedItems = await this.aggregateIngredients(ingredients);

    // create a command to add the aggregated ingredients to the shopping list
    const command = new AggregateShoppingListCommand({
      items: aggregatedItems,
      mealIds: weekPlanMealIds,
      shoppingListForWeekOf: startOfNextWeek,
    });

    await this.commandBus.execute(command);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: ShoppingListProcessor.name })
  async handleCron() {
    const job = this.schedulerRegistry.getCronJob(ShoppingListProcessor.name);
    job.stop();

    await this.process();

    job.start();
  }

  private async aggregateIngredients(ingredients: string[]) {
    const chat_completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },

      messages: [
        {
          role: 'system',
          content: `
              Organize and aggregate this list of ingredients. Combine ingredients that are the same.
              Return a list of ingredients and quantities. Each ingredient should also get a category based on where 
              I'd find it in the store. Return the result as an object with an "items" property which is a json 
              array where each item has a name, a quantity, and a category.
            `,
        },
        { role: 'user', content: ingredients.join('\n') },
      ],
    });

    const message = chat_completion.choices[0].message;

    const result = JSON.parse(message.content || '{}');

    return this.parsedShoppingListSchema.parse(result).items;
  }
}
