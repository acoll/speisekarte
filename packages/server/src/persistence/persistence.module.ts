import { Module } from '@nestjs/common';
import { Eventstore } from '~/common/eventstore';
import { PrismaEventstore } from './prisma.eventstore';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: Eventstore,
      useClass: PrismaEventstore, // TODO: Create in-memory event store for unit tests
    },
  ],
  exports: [Eventstore, PrismaService],
})
export class PersistenceModule {}
