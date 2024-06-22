import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const contract = c.router({
  saveRecipe: {
    method: 'POST',
    path: '/recipes',
    body: z.object({ url: z.string() }),
    responses: { 201: null },
    summary: 'Save a recipe',
  },
  list: {
    method: 'GET',
    path: '/recipes',
    responses: {
      200: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          status: z.union([
            z.literal('scraping'),
            z.literal('parsing'),
            z.literal('done'),
          ]),
        }),
      ),
    },
    summary: 'Get all recipes',
  },
  shoppingList: {
    method: 'GET',
    path: '/shopping-list',
    responses: {
      200: z.object({
        items: z.array(
          z.object({
            name: z.string(),
            quantity: z.string(),
            category: z.string(),
          }),
        ),
      }),
    },
    summary: 'Get the shopping list',
  },
  plannedMeals: {
    method: 'GET',
    path: '/week-plan',
    responses: {
      200: z.object({
        meals: z.array(
          z.object({ id: z.string(), name: z.string(), recipeId: z.string() }),
        ),
      }),
    },
    summary: 'Get the week plan',
  },
  planMeal: {
    method: 'POST',
    path: '/week-plan',
    body: z.object({ recipeId: z.string() }),
    responses: { 201: null },
    summary: 'Plan a meal',
  },
  recipe: {
    method: 'GET',
    path: '/recipes/:recipeId',
    responses: {
      200: z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        ingredients: z.array(z.string()),
        instructions: z.array(z.string()),
      }),
    },
    summary: 'Get a recipe',
  },
});
