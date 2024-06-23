import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ConsumerPersistenceAdapter,
  ConsumerProcessor,
} from '~/common/consumer';
import { EventRecord } from '~/common/event';
import { PrismaService } from '~/persistence/prisma.service';
import { ParseRecipeCommand } from './commands';
import { RecipeImageGenerator } from './openai/recipe-image-generator';
import { RecipeParser } from './openai/recipe-parser';

@Injectable()
export class ParserProcessor extends ConsumerProcessor {
  private isProcessing = false;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly recipeParser: RecipeParser,
    private readonly recipeImageGenerator: RecipeImageGenerator,
    private readonly prisma: PrismaService,
    protected readonly adapter: ConsumerPersistenceAdapter,
  ) {
    super(ParserProcessor.name, adapter);
  }

  @Cron(CronExpression.EVERY_SECOND, { name: ParserProcessor.name })
  async process() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    await super.process();

    this.isProcessing = false;
  }

  async consume(record: EventRecord) {
    const { event, tenantId } = record;

    if (event.type !== 'recipe-scraped') {
      return;
    }

    try {
      const { name, description, ingredients, instructions } =
        await this.recipeParser.parseRecipe(event.text);

      // TODO: Separate image generation from parsing
      const imageBuffer = await this.recipeImageGenerator.generateImage(name);

      // we need to store the image to our own file storage - just store in the db for now
      await this.prisma.image.upsert({
        where: { id: event.recipeId },
        update: { data: imageBuffer },
        create: { id: event.recipeId, data: imageBuffer },
      });

      const command = new ParseRecipeCommand(tenantId, {
        recipeId: event.recipeId,
        name,
        description,
        ingredients,
        instructions,
      });

      await this.commandBus.execute(command);
    } catch (error) {
      console.error(error);
      // TODO: append events for error cases
    }
  }
}
