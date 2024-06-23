import { Module } from '@nestjs/common';
import { ConsumerPersistenceAdapter } from '~/common/consumer';
import { Eventstore } from '~/common/eventstore';
import { PrismaConsumerPersistenceAdapter } from './prisma.consumer';
import { PrismaEventstore } from './prisma.eventstore';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: Eventstore,
      useClass: PrismaEventstore, // TODO: Create in-memory event store for unit tests
    },
    {
      provide: ConsumerPersistenceAdapter,
      useClass: PrismaConsumerPersistenceAdapter,
    },
  ],
  exports: [Eventstore, PrismaService, ConsumerPersistenceAdapter],
})
export class PersistenceModule {}
