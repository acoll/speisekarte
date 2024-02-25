import { Module } from '@nestjs/common';
import { ShoppingListController } from './controller';
import { AggregateShoppingListHandler } from './handler';
import { ShoppingListProcessor } from './processor';

@Module({
  imports: [],
  controllers: [ShoppingListController],
  providers: [ShoppingListProcessor, AggregateShoppingListHandler],
})
export class ShoppingListModule {}
