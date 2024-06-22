import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Eventstore } from '~/common/eventstore';
import { ParseRecipeCommand } from './commands';

@CommandHandler(ParseRecipeCommand)
export class ParseRecipeHandler implements ICommandHandler<ParseRecipeCommand> {
  constructor(private readonly eventstore: Eventstore) {}
  async execute(command: ParseRecipeCommand) {
    await this.eventstore.appendEvent(command.tenantId, {
      type: 'recipe-parsed',
      recipeId: command.data.recipeId,
      name: command.data.name,
      description: command.data.description,
      ingredients: command.data.ingredients,
      instructions: command.data.instructions,
    });
  }
}
