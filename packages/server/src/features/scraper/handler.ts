import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Eventstore } from '~/common/eventstore';
import { ScrapeRecipeCommand } from './commands';

@CommandHandler(ScrapeRecipeCommand)
export class ScrapeRecipeHandler
  implements ICommandHandler<ScrapeRecipeCommand>
{
  constructor(private readonly eventstore: Eventstore) {}
  async execute(command: ScrapeRecipeCommand) {
    // check if its been scraped already
    const eventsForUrl = await this.eventstore.getEvents({
      recipeId: command.recipeId,
      types: ['recipe-scraped'],
    });

    if (eventsForUrl.length > 0) {
      return;
    }

    await this.eventstore.appendEvent({
      type: 'recipe-scraped',
      recipeId: command.recipeId,
      images: command.images,
      text: command.content,
    });
  }
}
