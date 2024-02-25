import { Event, EventRecord } from './event';
import { ReadModel } from './readmodel';

export type GetEventsOptions = {
  startingAfterVersion?: number;
  types?: Event['type'][];
  limit?: number;
  recipeId?: string;
};

export abstract class Eventstore {
  abstract getEvents(options?: GetEventsOptions): Promise<EventRecord[]>;

  abstract appendEvent(event: Event): Promise<void>;

  async loadReadModel<R>(readModel: ReadModel<R>): Promise<R> {
    const events = await this.getEvents(readModel.options);

    return readModel.apply(events);
  }
}
