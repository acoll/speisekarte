import { Data } from 'effect';

export class AggregateShoppingListCommand extends Data.Class<{
  items: { name: string; category: string; quantity: string }[];
  mealIds: string[];
  shoppingListForWeekOf: Date;
}> {}
