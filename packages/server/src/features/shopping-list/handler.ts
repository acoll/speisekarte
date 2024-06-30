import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Eventstore } from '~/common/eventstore';
import {
  AggregateShoppingListCommand,
  RequestShoppingListCommand,
} from './commands';

@CommandHandler(AggregateShoppingListCommand)
export class AggregateShoppingListHandler
  implements ICommandHandler<AggregateShoppingListCommand>
{
  constructor(private readonly eventstore: Eventstore) {}
  async execute(command: AggregateShoppingListCommand) {
    // is there any validation here?

    await this.eventstore.appendEvent(command.tenantId, {
      type: 'shopping-list-aggregated',
      items: command.data.items,
      shoppingListForWeekOf: command.data.shoppingListForWeekOf,
    });
  }
}

@CommandHandler(RequestShoppingListCommand)
export class RequestShoppingListHandler
  implements ICommandHandler<RequestShoppingListCommand>
{
  constructor(private readonly eventstore: Eventstore) {}

  async execute(command: RequestShoppingListCommand) {
    // is there any validation here?

    await this.eventstore.appendEvent(command.tenantId, {
      type: 'shopping-list-requested',
      scheduledForWeekOf: command.data.scheduledForWeekOf,
    });
  }
}
