import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Eventstore } from '~/common/eventstore';
import { Processor } from '~/common/processor';
import { PrismaService } from '~/persistence/prisma.service';
import { ParseRecipeCommand } from './commands';
import { RecipeImageGenerator } from './openai/recipe-image-generator';
import { RecipeParser } from './openai/recipe-parser';
import { RecipesToBeParsed } from './processor-models';

@Injectable()
export class ParserProcessor extends Processor {
  private isProcessing = false;

  constructor(
    private readonly eventStore: Eventstore,
    private readonly commandBus: CommandBus,
    private readonly recipeParser: RecipeParser,
    private readonly recipeImageGenerator: RecipeImageGenerator,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: ParserProcessor.name })
  async process() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const recipesToBeParsed = await this.eventStore.loadReadModel(
        new RecipesToBeParsed(),
      );

      // do the actual scraping
      for (const recipe of recipesToBeParsed.recipes) {
        try {
          const { name, description, ingredients, instructions } =
            await this.recipeParser.parseRecipe(recipe.content);

          const imageBuffer =
            await this.recipeImageGenerator.generateImage(name);

          // we need to store the image to our own file storage - just store in the db for now
          await this.prisma.image.create({
            data: { id: recipe.id, data: imageBuffer },
          });

          await this.commandBus.execute(
            new ParseRecipeCommand({
              recipeId: recipe.id,
              name,
              description,
              ingredients,
              instructions,
            }),
          );
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }

    this.isProcessing = false;
  }
}
