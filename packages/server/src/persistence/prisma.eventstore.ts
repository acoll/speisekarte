import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Event, EventRecord } from '~/common/event';
import { Eventstore, GetEventsOptions } from '~/common/eventstore';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaEventstore extends Eventstore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async appendEvent(tenantId: string, event: Event) {
    await this.prisma.eventstore.create({
      data: { type: event.type, data: event, tenantId },
    });
  }

  async getEvents(options?: GetEventsOptions): Promise<EventRecord[]> {
    const where: Prisma.EventstoreWhereInput = {};

    if (options?.types) {
      where.type = { in: options.types };
    }

    if (options?.startingAfterVersion) {
      where.id = { gt: options.startingAfterVersion };
    }

    if (options?.recipeId) {
      where.data = {
        path: ['recipeId'],
        equals: options.recipeId,
      };
    }

    if (options?.tenantId) {
      where.tenantId = options.tenantId;
    }

    const rawRecords = await this.prisma.eventstore.findMany({
      where,
      orderBy: { id: 'asc' },
      take: options?.limit,
    });

    return rawRecords.map((record) => ({
      id: record.id,
      type: record.type as Event['type'],
      tenantId: record.tenantId,
      event: Event.parse(record.data),
      metadata: { createdAt: record.createdAt },
    }));
  }
}
