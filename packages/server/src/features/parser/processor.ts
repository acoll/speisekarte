import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Eventstore } from '~/common/eventstore';
import { PrismaService } from '~/persistence/prisma.service';
import { ParseRecipeCommand } from './commands';
import { RecipeImageGenerator } from './openai/recipe-image-generator';
import { RecipeParser } from './openai/recipe-parser';
import { RecipesToBeParsed } from './processor-models';

@Injectable()
export class ParserProcessor {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventStore: Eventstore,
    private readonly commandBus: CommandBus,
    private readonly recipeParser: RecipeParser,
    private readonly recipeImageGenerator: RecipeImageGenerator,
    private readonly prisma: PrismaService,
  ) {}

  async process() {
    const recipesToBeParsed = await this.eventStore.loadReadModel(
      new RecipesToBeParsed(),
    );

    // do the actual scraping
    for (const recipe of recipesToBeParsed.recipes) {
      const { ingredients, name, instructions } =
        await this.recipeParser.parseRecipe(recipe.content);

      const imageBuffer = await this.recipeImageGenerator.generateImage(name);

      // we need to store the image to our own file storage - just store in the db for now
      await this.prisma.image.create({
        data: { id: recipe.id, data: imageBuffer },
      });

      await this.commandBus.execute(
        new ParseRecipeCommand({
          recipeId: recipe.id,
          ingredients,
          name,
          instructions,
        }),
      );
    }
  }

  @Cron(CronExpression.EVERY_SECOND, { name: ParserProcessor.name })
  async handleCron() {
    const job = this.schedulerRegistry.getCronJob(ParserProcessor.name);
    job.stop();

    try {
      await this.process();
    } catch (err) {
      console.log(err);
    }

    job.start();
  }
}
