import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { OpenAIService } from '~/openai/service';

export abstract class RecipeParser {
  abstract parseRecipe(content: string): Promise<Recipe>;
}

type Recipe = {
  ingredients: string[];
  instructions: string[];
  name: string;
};

@Injectable()
export class OpenAIRecipeParser extends RecipeParser {
  private RecipeSchema = z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
  });

  constructor(private readonly openai: OpenAIService) {
    super();
  }

  async parseRecipe(content: string) {
    const chat_completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: this.prompt() },
        { role: 'user', content },
      ],
    });

    const message = chat_completion.choices[0].message;

    const result = JSON.parse(message.content || '{}');

    const recipe = this.RecipeSchema.parse(result);

    return recipe;
  }

  private prompt() {
    return `
            Your task is to analyze the given text and extract crucial information such as the 
            meal's name, ingredients list, and instructions list. Include ingredient quantities. 
            Return a json object containing name as a string, ingredients as an array of strings, 
            and instructions as an array of strings.
          `;
  }
}

@Injectable()
export class MockRecipeParser extends RecipeParser {
  async parseRecipe(): Promise<Recipe> {
    return {
      name: 'Mock Recipe',
      ingredients: ['1 cup of water', '1 cup of sugar'],
      instructions: ['Mix the water and sugar', 'Enjoy'],
    };
  }
}
