import { Module } from '@nestjs/common';
import { WeekPlanController } from './controller';
import { PlanMealHandler } from './handler';

@Module({
  imports: [],
  controllers: [WeekPlanController],
  providers: [PlanMealHandler],
})
export class WeekPlanModule {}
