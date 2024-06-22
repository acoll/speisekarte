import { Command } from '~/common/command';

export class AggregateShoppingListCommand extends Command<{
  items: { name: string; category: string; quantity: string }[];
  shoppingListForWeekOf: Date;
}> {}
