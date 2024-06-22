import { Module } from '@nestjs/common';
import { OpenAIModule } from '~/openai/_module';
import { ShoppingListController } from './controller';
import { AggregateShoppingListHandler } from './handler';
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
    {
      provide: ShoppingListAggregator,
      useClass: OpenAIShoppingListAggregator,
    },
  ],
})
export class ShoppingListModule {}
