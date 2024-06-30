import { z } from 'zod';

const RecipeSaved = z.object({
  type: z.literal('recipe-saved'),
  recipeId: z.string(),
  url: z.string(),
});

type RecipeSaved = z.infer<typeof RecipeSaved>;

const RecipeScraped = z.object({
  type: z.literal('recipe-scraped'),
  recipeId: z.string(),
  text: z.string(),
});

type RecipeScraped = z.infer<typeof RecipeScraped>;

const RecipeParsed = z.object({
  type: z.literal('recipe-parsed'),
  recipeId: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});

type RecipeParsed = z.infer<typeof RecipeParsed>;

const MealPlanned = z.object({
  mealId: z.string(),
  recipeId: z.string(),
  type: z.literal('meal-planned'),
  name: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  scheduledForWeekOf: z.coerce.date(),
});

const ShoppingListRequested = z.object({
  type: z.literal('shopping-list-requested'),
  scheduledForWeekOf: z.coerce.date(),
});

type ShoppingListRequested = z.infer<typeof ShoppingListRequested>;

type MealPlanned = z.infer<typeof MealPlanned>;

const ShoppingListAggregated = z.object({
  type: z.literal('shopping-list-aggregated'),
  items: z.array(
    z.object({ name: z.string(), quantity: z.string(), category: z.string() }),
  ),
  shoppingListForWeekOf: z.coerce.date(),
});

type ShoppingListAggregated = z.infer<typeof ShoppingListAggregated>;

const ShoppingListItemChecked = z.object({
  type: z.literal('shopping-list-item-checked'),
  name: z.string(),
  checked: z.boolean(),
});

type ShoppingListItemChecked = z.infer<typeof ShoppingListItemChecked>;

export const Event = z.discriminatedUnion('type', [
  RecipeSaved,
  RecipeScraped,
  RecipeParsed,
  MealPlanned,
  ShoppingListRequested,
  ShoppingListAggregated,
  ShoppingListItemChecked,
]);

export type Event = z.infer<typeof Event>;

export type EventRecord<T extends Event['type'] = Event['type']> = {
  id: number;
  type: T;
  tenantId: string;
  event: Extract<Event, { type: T }>;
  metadata: { createdAt: Date };
};
