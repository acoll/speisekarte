import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { Eventstore } from '~/common/eventstore';
import { contract } from '../../api';
import { RecipeReadModel, RecipesReadModel } from './controller-models';

@Controller()
export class RecipesController {
  constructor(private readonly eventStore: Eventstore) {}

  @TsRestHandler(contract.list)
  async list() {
    return tsRestHandler(contract.list, async () => {
      const { recipes } = await this.eventStore.loadReadModel(
        new RecipesReadModel(),
      );
      return { status: 200, body: recipes };
    });
  }

  @TsRestHandler(contract.recipe)
  async recipe() {
    return tsRestHandler(contract.recipe, async ({ params }) => {
      const { recipeId } = params;
      const { recipe } = await this.eventStore.loadReadModel(
        new RecipeReadModel(recipeId),
      );

      if (!recipe) {
        return { status: 404, body: { message: 'Recipe not found' } };
      }

      return { status: 200, body: recipe };
    });
  }
}
