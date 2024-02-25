import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Eventstore } from '~/common/eventstore';
import { ParseRecipeCommand } from './commands';

@CommandHandler(ParseRecipeCommand)
export class ParseRecipeHandler implements ICommandHandler<ParseRecipeCommand> {
  constructor(private readonly eventstore: Eventstore) {}
  async execute(command: ParseRecipeCommand) {
    await this.eventstore.appendEvent({
      type: 'recipe-parsed',
      recipeId: command.recipeId,
      ingredients: command.ingredients,
      instructions: command.instructions,
      name: command.name,
    });
  }
}
