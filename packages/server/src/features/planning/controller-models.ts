/**
 * View models are used by the read models to render the UI
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

  meals: {
    id: string;
    name: string;
    recipeId: string;
  }[] = [];

  constructor(
    private readonly startOfWeek: Date,
    private readonly tenantId: string,
  ) {
    super();
  }

  apply(events: EventRecord[]) {
    const startOfWeek = dayjs(this.startOfWeek);

    for (const { event } of events) {
      if (event.type === 'meal-planned') {
        const scheduledForWeekOf = dayjs(event.scheduledForWeekOf);

        if (scheduledForWeekOf.isSame(startOfWeek, 'day')) {
          this.meals.push({
            id: event.mealId,
            name: event.name,
            recipeId: event.recipeId,
          });
        }
      }
    }

    return this;
  }
}
