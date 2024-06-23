import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { Eventstore } from '~/common/eventstore';
import { Processor } from '~/common/processor';
import { AggregateShoppingListCommand } from './commands';
import { ShoppingListAggregator } from './openai/shopping-list-aggregator';
import {
  TenantsWithUnaggregatedShoppingList,
  UnaggregatedShoppingList,
} from './processor-models';

@Injectable()
export class ShoppingListProcessor extends Processor {
  private isProcessing = false;

  constructor(
    private readonly eventstore: Eventstore,
    private readonly commandBus: CommandBus,
    private readonly shoppingListAggregator: ShoppingListAggregator,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: ShoppingListProcessor.name })
  async process() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const startOfNextWeek = dayjs().startOf('week').add(1, 'week').toDate();

      // get all tenants who need their shopping list aggregated
      const { tenantIds } = await this.eventstore.loadReadModel(
        new TenantsWithUnaggregatedShoppingList(startOfNextWeek),
      );

      for (const tenantId of tenantIds) {
        // get all unaggregated shopping lists
        const { items } = await this.eventstore.loadReadModel(
          new UnaggregatedShoppingList(startOfNextWeek, tenantId),
        );

        const aggregatedItems =
          await this.shoppingListAggregator.aggregate(items);

        const command = new AggregateShoppingListCommand(tenantId, {
          items: aggregatedItems,
          shoppingListForWeekOf: startOfNextWeek,
        });

        await this.commandBus.execute(command);
      }
    } catch (err) {
      console.error(err);
    }

    this.isProcessing = false;
  }
}
