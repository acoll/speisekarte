import { EventRecord } from './event';
import { GetEventsOptions } from './eventstore';

export abstract class ReadModel<T> {
  abstract options: GetEventsOptions;
  abstract apply(events: EventRecord[]): T;
}
