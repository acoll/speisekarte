import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class RecipesToBeParsed extends ReadModel<RecipesToBeParsed> {
  recipes: { tenantId: string; id: string; content: string }[] = [];

  options: GetEventsOptions = {
    types: ['recipe-scraped', 'recipe-parsed'],
    limit: 100,
  };

  apply(events: EventRecord[]): RecipesToBeParsed {
    for (const { event, tenantId } of events) {
      if (event.type === 'recipe-scraped') {
        this.recipes.push({
          id: event.recipeId,
          content: event.text,
          tenantId,
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
