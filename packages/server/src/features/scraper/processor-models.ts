import { EventRecord } from '~/common/event';
import { GetEventsOptions } from '~/common/eventstore';
import { ReadModel } from '~/common/readmodel';

export class RecipePagesToScrape extends ReadModel<RecipePagesToScrape> {
  recipePagesToScrape: { tenantId: string; id: string; url: string }[] = [];

  options: GetEventsOptions = {
    types: ['recipe-saved', 'recipe-scraped'],
    limit: 100,
  };

  apply(events: EventRecord[]): RecipePagesToScrape {
    for (const { event, tenantId } of events) {
      if (event.type === 'recipe-saved') {
        this.recipePagesToScrape.push({
          tenantId,
          id: event.recipeId,
          url: event.url,
        });
      }

      if (event.type === 'recipe-scraped') {
        this.recipePagesToScrape = this.recipePagesToScrape.filter(
          (recipe) => recipe.id !== event.recipeId,
        );
      }
    }

    return this;
  }
}
