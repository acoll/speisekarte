import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class RecipesReadModel extends ReadModel<RecipesReadModel> {
  recipes: {
    id: string;
    name: string;
    pending: boolean;
  }[] = [];

  options: GetEventsOptions = {};

  apply(events: EventRecord[]): RecipesReadModel {
    for (const { event } of events) {
      if (event.type === 'recipe-saved') {
        this.recipes.push({
          id: event.recipeId,
          name: '',
          pending: true,
        });
      }

      if (event.type === 'recipe-parsed') {
        const recipe = this.recipes.find((r) => r.id === event.recipeId);
        if (recipe) {
          recipe.name = event.name;
          recipe.pending = false;
        }
      }
    }

    return this;
  }
}

export class RecipeReadModel extends ReadModel<RecipeReadModel> {
  options: GetEventsOptions = {
    types: ['recipe-parsed'],
    recipeId: this.recipeId,
  };
  recipe: {
    id: string;
    name: string;
    ingredients: string[];
    instructions: string[];
  } | null = null;

  constructor(private readonly recipeId: string) {
    super();
  }

  apply(events: EventRecord[]) {
    for (const { event } of events) {
      if (event.type === 'recipe-parsed') {
        this.recipe = {
          id: event.recipeId,
          name: event.name,
          ingredients: event.ingredients,
          instructions: event.instructions,
        };
      }
    }

    return this;
  }
}
