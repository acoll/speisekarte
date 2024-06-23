import { Injectable } from '@nestjs/common';
import { ConsumerPersistenceAdapter } from '~/common/consumer';
import { EventRecord } from '~/common/event';
import { Eventstore } from '~/common/eventstore';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaConsumerPersistenceAdapter extends ConsumerPersistenceAdapter {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: Eventstore,
  ) {
    super();
  }

  async saveCheckpoint(processorId: string, event: EventRecord): Promise<void> {
    await this.prisma.consumer.update({
      where: { id: processorId },
      data: { lastEventConsumed: event.id },
    });
  }

  async loadCheckpoint(processorId: string) {
    const { lastEventConsumed } = await this.prisma.consumer.upsert({
      where: { id: processorId },
      create: { id: processorId, lastEventConsumed: -1 },
      update: {},
    });

    return lastEventConsumed;
  }

  async fetchEvents(lastEventConsumed?: number): Promise<EventRecord[]> {
    const events = await this.eventStore.getEvents({
      startingAfterVersion: lastEventConsumed,
    });

    return events;
  }
}
