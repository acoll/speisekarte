import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ConsumerPersistenceAdapter,
  ConsumerProcessor,
} from '~/common/consumer';
import { EventRecord } from '~/common/event';
import { Eventstore } from '~/common/eventstore';
import { AggregateShoppingListCommand } from './commands';
import { ShoppingListAggregator } from './openai/shopping-list-aggregator';
import { UnaggregatedShoppingList } from './processor-models';

@Injectable()
export class ShoppingListProcessor extends ConsumerProcessor {
  private isProcessing = false;

  constructor(
    private readonly eventstore: Eventstore,
    private readonly commandBus: CommandBus,
    private readonly shoppingListAggregator: ShoppingListAggregator,
    protected readonly adapter: ConsumerPersistenceAdapter,
  ) {
    super(ShoppingListProcessor.name, adapter);
  }

  @Cron(CronExpression.EVERY_SECOND, { name: ShoppingListProcessor.name })
  async process() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await super.process();

    this.isProcessing = false;
  }

  async consume(record: EventRecord) {
    const { event, tenantId } = record;

    console.log('Shopping List Processor', event);

    if (event.type !== 'shopping-list-requested') {
      return;
    }

    try {
      const { items } = await this.eventstore.loadReadModel(
        new UnaggregatedShoppingList(event.scheduledForWeekOf, tenantId),
      );

      const aggregatedItems =
        await this.shoppingListAggregator.aggregate(items);

      const command = new AggregateShoppingListCommand(tenantId, {
        items: aggregatedItems,
        shoppingListForWeekOf: event.scheduledForWeekOf,
      });

      await this.commandBus.execute(command);
    } catch (error) {
      console.error(error);
      // TODO: append events for error cases
    }
  }
}
