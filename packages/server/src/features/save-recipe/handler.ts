import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Eventstore } from '~/common/eventstore';
import { SaveRecipeCommand } from './commands';

@CommandHandler(SaveRecipeCommand)
export class SaveRecipeHandler implements ICommandHandler<SaveRecipeCommand> {
  constructor(private readonly eventstore: Eventstore) {}
  async execute(command: SaveRecipeCommand) {
    await this.eventstore.appendEvent(command.tenantId, {
      type: 'recipe-saved',
      url: command.data.url,
      recipeId: command.data.recipeId,
    });
  }
}
