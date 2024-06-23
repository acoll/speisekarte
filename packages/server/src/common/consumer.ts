import { EventRecord } from './event';
import { Processor } from './processor';

export abstract class ConsumerPersistenceAdapter {
  abstract saveCheckpoint(
    processorId: string,
    event: EventRecord,
  ): Promise<void>;
  abstract loadCheckpoint(processorId: string): Promise<number>;

  abstract fetchEvents(lastEventConsumed: number): Promise<EventRecord[]>;
}

export abstract class ConsumerProcessor extends Processor {
  private lastEventConsumed: number | null = null;

  constructor(
    private readonly consumerId: string,
    protected readonly adapter: ConsumerPersistenceAdapter,
  ) {
    super();
  }

  abstract consume(event: EventRecord): Promise<void>;

  async process() {
    if (this.lastEventConsumed === null) {
      this.lastEventConsumed = await this.adapter.loadCheckpoint(
        this.consumerId,
      );
    }

    const events = await this.adapter.fetchEvents(this.lastEventConsumed);

    for (const event of events) {
      await this.consume(event);
      await this.adapter.saveCheckpoint(this.consumerId, event);
      this.lastEventConsumed = event.id;
    }
  }
}
