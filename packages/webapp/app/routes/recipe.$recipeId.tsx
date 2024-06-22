import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { RecipePageComponent } from "~/components/recipe-page";
import { getApiClient } from "~/lib/api";

export const loader = async (args: LoaderFunctionArgs) => {
  const { recipeId } = args.params;

  const api = await getApiClient(args);

  const recipeResponse = await api.recipe({ params: { recipeId: recipeId! } });

  if (recipeResponse.status !== 200) {
    throw new Error("Failed to fetch recipe");
  }

  const recipe = recipeResponse.body;

  return json({ recipe });
};

export default function RecipePage() {
  const { recipe } = useLoaderData<typeof loader>();

  return (
    <>
      <Outlet />
      <RecipePageComponent
        recipe={{
          name: recipe.name,
          description: recipe.description,
          imageUrl: `/image/${recipe.id}`,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          tips: [], // TODO
        }}
      />
    </>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const recipeId = String(formData.get("recipeId"));

  const api = await getApiClient(args);

  await api.planMeal({ body: { recipeId } });

  return redirect("/recipes");
};
