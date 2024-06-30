import { Module } from '@nestjs/common';
import { OpenAIModule } from '~/openai/_module';
import { ShoppingListController } from './controller';
import {
  AggregateShoppingListHandler,
  RequestShoppingListHandler,
} from './handler';
import {
  OpenAIShoppingListAggregator,
  ShoppingListAggregator,
} from './openai/shopping-list-aggregator';
import { ShoppingListProcessor } from './processor';

@Module({
  imports: [OpenAIModule],
  controllers: [ShoppingListController],
  providers: [
    ShoppingListProcessor,
    AggregateShoppingListHandler,
    RequestShoppingListHandler,
    {
      provide: ShoppingListAggregator,
      useClass: OpenAIShoppingListAggregator,
    },
  ],
})
export class ShoppingListModule {}
