/**
 * v0 by Vercel.
 * @see https://v0.dev/t/p2M0tqeegUs
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { getApiClient } from "~/lib/api";

export const loader = async (args: LoaderFunctionArgs) => {
  const api = await getApiClient(args);

  const [plannedMealsResponse, shoppingListResponse] = await Promise.all([
    api.plannedMeals(),
    api.shoppingList(),
  ]);

  if (plannedMealsResponse.status !== 200) {
    throw new Error("Failed to fetch week plan");
  }

  if (shoppingListResponse.status !== 200) {
    throw new Error("Failed to fetch shopping list");
  }

  return json({
    meals: plannedMealsResponse.body.meals,
    shoppingListItems: shoppingListResponse.body.items,
    shoppingListStatus: shoppingListResponse.body.status,
  });
};

export default function Component() {
  const { meals, shoppingListItems, shoppingListStatus } =
    useLoaderData<typeof loader>();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const initialShoppingList = shoppingListItems.reduce(
    (acc, item) => {
      let category = acc.find((c) => c.category === item.category);

      if (!category) {
        category = { category: item.category, items: [] };
        acc.push(category);
      }

      category.items.push({
        name: item.name,
        quantity: item.quantity,
        purchased: false,
      });

      return acc;
    },
    [] as {
      category: string;
      items: { name: string; quantity: string; purchased: boolean }[];
    }[]
  );

  const [shoppingList, setShoppingList] = useState(initialShoppingList);

  const handleItemPurchase = (categoryIndex: number, itemIndex: number) => {
    const updatedShoppingList = [...shoppingList];
    updatedShoppingList[categoryIndex].items[itemIndex].purchased =
      !updatedShoppingList[categoryIndex].items[itemIndex].purchased;
    setShoppingList(updatedShoppingList);
  };

  return (
    <div className="mx-auto py-8 container">
      <h1 className="text-3xl font-bold mb-6">Weekly Meal Planner</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day, index) => (
          // TODO: Build a page for the meal instead of linking back to the recipe
          // This is for the future case where you've planned and shopped and then changed a recipe.
          // You would want to see the steps and ingredients that you planned, not the new updated recipe.
          <Link
            to={meals[index] ? `/recipe/${meals[index]?.recipeId}` : "/"}
            key={day}
          >
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">{day}</h2>
              <p className="text-gray-600">{meals[index]?.name ?? ""}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-4">
          Shopping List
          {shoppingListStatus === "changed" && (
            <Form method="post">
              <Button type="submit">Request Shopping List</Button>
            </Form>
          )}
          {shoppingListStatus === "requested" ? (
            <p className="italic text-gray-400 text-sm">Building...</p>
          ) : (
            ""
          )}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shoppingList.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h3 className="text-lg font-bold mb-2">{category.category}</h3>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center">
                    <Checkbox
                      checked={item.purchased}
                      onCheckedChange={() =>
                        handleItemPurchase(categoryIndex, itemIndex)
                      }
                      className="mr-2"
                    />
                    <span
                      className={`${
                        item.purchased ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {item.name} ({item.quantity})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const api = await getApiClient(args);

  await api.requestShoppingList();

  return redirect("/");
};
