import { Controller, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import { Eventstore } from '~/common/eventstore';
import { contract } from '../../api';
import { PlanMealCommand } from './commands';
import { PlannedMeals } from './controller-models';

@Controller()
export class WeekPlanController {
  constructor(
    private readonly eventStore: Eventstore,
    private readonly commandBus: CommandBus,
  ) {}

  @TsRestHandler(contract.plannedMeals)
  async plannedMeals() {
    return tsRestHandler(contract.plannedMeals, async () => {
      const startOfNextWeek = dayjs().startOf('week').add(1, 'week').toDate();

      const { meals } = await this.eventStore.loadReadModel(
        new PlannedMeals(startOfNextWeek),
      );

      return { status: 200, body: { meals } };
    });
  }

  @TsRestHandler(contract.planMeal)
  async planMeal(@Req() req: Request) {
    return tsRestHandler(contract.planMeal, async ({ body }) => {
      const recipeId = body.recipeId;

      const startOfNextWeek = dayjs().startOf('week').add(1, 'week').toDate();

      await this.commandBus.execute(
        new PlanMealCommand(req.userId, {
          scheduledForWeekOf: startOfNextWeek,
          recipeId,
        }),
      );
      return { status: 201, body: null };
    });
  }
}
