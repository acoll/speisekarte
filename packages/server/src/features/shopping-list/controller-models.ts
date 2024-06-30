import * as dayjs from 'dayjs';
import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class ShoppingList extends ReadModel<ShoppingList> {
  options: GetEventsOptions = {
    tenantId: this.tenantId,
    types: [
      'shopping-list-aggregated',
      'meal-planned',
      'shopping-list-requested',
    ],
  };

  items: {
    name: string;
    quantity: string;
    category: string;
  }[] = [];

  status: 'changed' | 'ready' | 'requested' = 'changed';

  constructor(
    private readonly startOfWeek: Date,
    private readonly tenantId: string,
  ) {
    super();
  }

  apply(events: EventRecord[]) {
    const startOfWeek = dayjs(this.startOfWeek);

    const isSameWeek = (date: Date) => dayjs(date).isSame(startOfWeek, 'day');

    for (const { event } of events) {
      if (
        event.type === 'shopping-list-requested' &&
        isSameWeek(event.scheduledForWeekOf)
      ) {
        this.items = [];
        this.status = 'requested';
      }

      if (
        event.type === 'meal-planned' &&
        isSameWeek(event.scheduledForWeekOf)
      ) {
        this.items = [];
        this.status = 'changed';
      }

      if (
        event.type === 'shopping-list-aggregated' &&
        isSameWeek(event.shoppingListForWeekOf)
      ) {
        this.items = event.items;
        this.status = 'ready';
      }
    }

    return this;
  }
}
