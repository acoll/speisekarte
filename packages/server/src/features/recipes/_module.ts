import { Module } from '@nestjs/common';

import { RecipesController } from './controller';

@Module({
  imports: [],
  controllers: [RecipesController],
  exports: [],
})
export class RecipesModule {}
