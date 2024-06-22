import { Controller, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { contract } from '../../api';
import { SaveRecipeCommand } from './commands';

@Controller()
export class SaveRecipeController {
  constructor(private readonly commandBus: CommandBus) {}

  @TsRestHandler(contract.saveRecipe, { validateResponses: true })
  async saveRecipe(@Req() req: Request) {
    return tsRestHandler(contract.saveRecipe, async ({ body }) => {
      await this.commandBus.execute(
        new SaveRecipeCommand(req.userId, {
          url: body.url,
          recipeId: randomUUID(),
        }),
      );
      return { status: 201, body: null };
    });
  }
}
