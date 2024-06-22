import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { OpenAIService } from '~/openai/service';

type ShoppingList = {
  name: string;
  quantity: string;
  category: string;
}[];

export abstract class ShoppingListAggregator {
  abstract aggregate(ingredients: string[]): Promise<ShoppingList>;
}

@Injectable()
export class OpenAIShoppingListAggregator extends ShoppingListAggregator {
  private ShoppingListSchema = z.object({
    items: z.array(
      z.object({
        name: z.string(),
        category: z.string(),
        quantity: z.coerce.string(),
      }),
    ),
  });

  constructor(private readonly openai: OpenAIService) {
    super();
  }
  async aggregate(ingredients: string[]): Promise<ShoppingList> {
    const chat_completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: this.prompt() },
        { role: 'user', content: ingredients.join('\n') },
      ],
    });

    const message = chat_completion.choices[0].message;

    const result = JSON.parse(message.content || '{}');

    return this.ShoppingListSchema.parse(result).items;
  }

  private prompt() {
    return `
        Organize and aggregate this list of ingredients provided. Combine ingredients that are the same.
        Return a list of ingredients and quantities.  Each ingredient should also get a category based on where 
        I'd find it in the store. Return the result as an object with an "items" property which is a json 
        array where each item has a name, a quantity, and a category.

        Quantities should be in an amount that can normally be purchased at a grocery store. For example, if a 
        recipe requires a small quantity like 2 tbsp of oil, just say olive oil. Only specify the quantity if it's
        an unusually large amount required for the recipe.

        When a recipe says "salt and pepper to taste" don't include that in the shopping list.
    `;
  }
}
