import * as dayjs from 'dayjs';
import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class ShoppingList extends ReadModel<ShoppingList> {
  options: GetEventsOptions = {
    tenantId: this.tenantId,
    types: ['shopping-list-aggregated'],
  };

  items: {
    name: string;
    quantity: string;
    category: string;
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
      if (event.type === 'shopping-list-aggregated') {
        const shoppingListForWeekOf = dayjs(event.shoppingListForWeekOf);

        if (shoppingListForWeekOf.isSame(startOfWeek, 'day')) {
          this.items = event.items;
        }
      }
    }

    return this;
  }
}
