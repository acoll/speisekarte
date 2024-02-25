/**
 * v0 by Vercel.
 * @see https://v0.dev/t/p2M0tqeegUs
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { api } from "~/lib/api";

export const meta: MetaFunction = () => {
  return [
    { title: "Speisekarte" },
    { name: "description", content: "What's for dinner?" },
  ];
};

export const loader = async () => {
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
  });
};

export default function Component() {
  const { meals, shoppingListItems } = useLoaderData<typeof loader>();

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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weekly Meal Planner</h1>
        <div className="flex items-center gap-2">
          <Link to="/recipes/new">
            <Button>Add Recipe</Button>
          </Link>
          <Link to="/recipes">
            <Button>Recipes</Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day, index) => (
          // TODO: Build a page for the meal instead of linking back to the recipe
          // This is for the future case where you've planned and shopped and then changed a recipe.
          // You would want to see the steps and ingredients that you planned, not the new updated recipe.
          <Link
            to={meals[index] ? `/recipes/${meals[index]?.recipeId}` : "/"}
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
        <h2 className="text-2xl font-bold mb-4">Shopping List</h2>
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
