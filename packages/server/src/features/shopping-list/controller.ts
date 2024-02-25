import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import * as dayjs from 'dayjs';
import { Eventstore } from '~/common/eventstore';
import { contract } from '../../api';
import { ShoppingList } from './controller-models';

@Controller()
export class ShoppingListController {
  constructor(
    private readonly eventStore: Eventstore,
    private readonly commandBus: CommandBus,
  ) {}

  @TsRestHandler(contract.shoppingList)
  async getShoppingList() {
    return tsRestHandler(contract.shoppingList, async () => {
      const startOfNextWeek = dayjs().startOf('week').add(1, 'week').toDate();

      const { items } = await this.eventStore.loadReadModel(
        new ShoppingList(startOfNextWeek),
      );

      return { status: 200, body: { items } };
    });
  }
}
