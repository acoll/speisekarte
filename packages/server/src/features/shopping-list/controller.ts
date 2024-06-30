import { Controller, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import { Eventstore } from '~/common/eventstore';
import { contract } from '../../api';
import { RequestShoppingListCommand } from './commands';
import { ShoppingList } from './controller-models';

@Controller()
export class ShoppingListController {
  constructor(
    private readonly eventStore: Eventstore,
    private readonly commandBus: CommandBus,
  ) {}

  @TsRestHandler(contract.shoppingList)
  async getShoppingList(@Req() req: Request) {
    return tsRestHandler(contract.shoppingList, async () => {
      const startOfNextWeek = dayjs().startOf('week').add(1, 'week').toDate();

      const { items, status } = await this.eventStore.loadReadModel(
        new ShoppingList(startOfNextWeek, req.userId),
      );

      return { status: 200, body: { items, status } };
    });
  }

  @TsRestHandler(contract.requestShoppingList)
  async requestShoppingList(@Req() req: Request) {
    return tsRestHandler(contract.requestShoppingList, async () => {
      const startOfNextWeek = dayjs().startOf('week').add(1, 'week').toDate();

      await this.commandBus.execute(
        new RequestShoppingListCommand(req.userId, {
          scheduledForWeekOf: startOfNextWeek,
        }),
      );

      return { status: 201, body: null };
    });
  }
}
