import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class RecipesToBeParsed extends ReadModel<RecipesToBeParsed> {
  recipes: { id: string; content: string; images: string[] }[] = [];

  options: GetEventsOptions = {
    types: ['recipe-scraped', 'recipe-parsed'],
    limit: 100,
  };

  apply(events: EventRecord[]): RecipesToBeParsed {
    for (const { event } of events) {
      if (event.type === 'recipe-scraped') {
        this.recipes.push({
          id: event.recipeId,
          content: event.text,
          images: event.images,
        });
      }

      if (event.type === 'recipe-parsed') {
        this.recipes = this.recipes.filter(
          (recipe) => recipe.id !== event.recipeId,
        );
      }
    }

    return this;
  }
}
