import * as dayjs from 'dayjs';
import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

type TenantID = string;

export class TenantsWithUnaggregatedShoppingList extends ReadModel<TenantsWithUnaggregatedShoppingList> {
  options: GetEventsOptions = {
    types: ['meal-planned', 'shopping-list-aggregated'],
    limit: 100,
  };

  tenantIds: Set<TenantID> = new Set();

  constructor(private readonly startOfWeek: Date) {
    super();
  }

  apply(events: EventRecord[]) {
    const startOfWeek = dayjs(this.startOfWeek);

    for (const { event, tenantId } of events) {
      if (
        event.type === 'meal-planned' &&
        startOfWeek.isSame(dayjs(event.scheduledForWeekOf), 'day')
      ) {
        this.tenantIds.add(tenantId);
      }

      if (
        event.type === 'shopping-list-aggregated' &&
        startOfWeek.isSame(dayjs(event.shoppingListForWeekOf), 'day')
      ) {
        this.tenantIds.delete(tenantId);
      }
    }

    return this;
  }
}

export class UnaggregatedShoppingList extends ReadModel<UnaggregatedShoppingList> {
  options: GetEventsOptions = {
    types: ['meal-planned'],
    tenantId: this.tenantId,
    limit: 100,
  };

  items: string[] = [];

  constructor(
    private readonly startOfWeek: Date,
    private readonly tenantId: TenantID,
  ) {
    super();
  }

  apply(events: EventRecord[]) {
    const startOfWeek = dayjs(this.startOfWeek);

    for (const { event } of events) {
      if (
        event.type === 'meal-planned' &&
        startOfWeek.isSame(dayjs(event.scheduledForWeekOf), 'day')
      ) {
        this.items.push(...event.ingredients);
      }
    }

    return this;
  }
}
