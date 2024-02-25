import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { randomUUID } from 'crypto';
import { contract } from '../../api';
import { SaveRecipeCommand } from './commands';

@Controller()
export class SaveRecipeController {
  constructor(private readonly commandBus: CommandBus) {}

  @TsRestHandler(contract.saveRecipe, { validateResponses: true })
  async saveRecipe() {
    return tsRestHandler(contract.saveRecipe, async ({ body }) => {
      await this.commandBus.execute(
        new SaveRecipeCommand({
          url: body.url,
          recipeId: randomUUID(),
        }),
      );
      return { status: 201, body: null };
    });
  }
}
