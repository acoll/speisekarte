import * as dayjs from 'dayjs';
import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

type TenantID = string;

export class UnaggregatedShoppingList extends ReadModel<UnaggregatedShoppingList> {
  options: GetEventsOptions = {
    types: ['meal-planned'],
    tenantId: this.tenantId,
    limit: 100, // naive arbitrary limit to avoid fetching too many events
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
