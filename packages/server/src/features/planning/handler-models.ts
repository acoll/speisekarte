/**
 * State models are used by command handlers to decide whether to apply events or not.
 */

import * as dayjs from 'dayjs';
import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class PlannedMeals extends ReadModel<PlannedMeals> {
  options: GetEventsOptions = {
    types: ['meal-planned'],
    tenantId: this.tenantId,
  };

  meals: Set<string> = new Set();

  constructor(
    private readonly startOfWeek: Date,
    private readonly tenantId: string,
  ) {
    super();
  }

  apply(events: EventRecord[]): PlannedMeals {
    const startOfWeek = dayjs(this.startOfWeek);

    for (const { event } of events) {
      if (event.type === 'meal-planned') {
        const scheduledForWeekOf = dayjs(event.scheduledForWeekOf);

        if (scheduledForWeekOf.isSame(startOfWeek, 'day')) {
          this.meals.add(event.mealId);
        }
      }
    }

    return this;
  }
}

export class RecipeReadModel extends ReadModel<RecipeReadModel> {
  recipe: {
    id: string;
    name: string;
    ingredients: string[];
    steps: string[];
  } | null = null;

  options: GetEventsOptions = {
    types: ['recipe-parsed'],
    recipeId: this.recipeId,
  };

  constructor(private readonly recipeId: string) {
    super();
  }

  apply(events: EventRecord[]) {
    for (const { event } of events) {
      if (event.type === 'recipe-parsed') {
        this.recipe = {
          id: event.recipeId,
          name: event.name,
          ingredients: event.ingredients,
          steps: event.instructions,
        };
      }
    }

    return this;
  }
}
