import * as dayjs from 'dayjs';
import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class PlannedMeals extends ReadModel<PlannedMeals> {
  options: GetEventsOptions = { types: ['meal-planned'], limit: 100 };

  meals: { id: string; ingredients: string[] }[] = [];

  constructor(private readonly startOfWeek: Date) {
    super();
  }

  apply(events: EventRecord[]) {
    const startOfWeek = dayjs(this.startOfWeek);

    for (const { event } of events) {
      if (event.type === 'meal-planned') {
        const scheduledForWeekOf = dayjs(event.scheduledForWeekOf);

        if (scheduledForWeekOf.isSame(startOfWeek, 'day')) {
          this.meals.push({ id: event.mealId, ingredients: event.ingredients });
        }
      }
    }

    return this;
  }
}

export class ShoppingListMeals extends ReadModel<ShoppingListMeals> {
  options: GetEventsOptions = {
    types: ['shopping-list-aggregated'],
    limit: 100,
  };

  meals: Set<string> = new Set();

  constructor(private readonly startOfWeek: Date) {
    super();
  }

  apply(events: EventRecord[]) {
    const startOfWeek = dayjs(this.startOfWeek);

    for (const { event } of events) {
      if (event.type === 'shopping-list-aggregated') {
        const shoppingListForWeekOf = dayjs(event.shoppingListForWeekOf);

        if (shoppingListForWeekOf.isSame(startOfWeek, 'day')) {
          this.meals = new Set(event.mealIds);
        }
      }
    }

    return this;
  }
}
