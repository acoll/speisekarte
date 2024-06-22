import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { getApiClient } from "~/lib/api";

export const loader = async (args: LoaderFunctionArgs) => {
  const { recipeId } = args.params;

  const api = await getApiClient(args);

  const [planResponse, recipeResponse] = await Promise.all([
    api.plannedMeals(),
    api.recipe({ params: { recipeId: recipeId! } }),
  ]);

  if (planResponse.status !== 200 || recipeResponse.status !== 200) {
    throw new Error("Failed to fetch week plan");
  }

  const { meals } = planResponse.body;
  const recipe = recipeResponse.body;

  return json({ meals, recipe });
};

export default function RecipePage() {
  const { meals, recipe } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const schedule = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <Dialog
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          navigate(`/recipe/${recipe.id}`);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>
            {`This recipe will be scheduled for the upcoming week. Here's what else is scheduled:`}
          </p>
          <div className="grid gap-4">
            {schedule.map((day, index) => (
              <div
                key={day}
                className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="font-semibold">{meals[index]?.name ?? ""}</div>
                <div className="text-gray-500 dark:text-gray-400">{day}</div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Form className="flex gap-2" method="post">
            <input type="hidden" name="recipeId" value={recipe.id} />
            <Button
              type="button"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const recipeId = String(formData.get("recipeId"));

  const api = await getApiClient(args);

  await api.planMeal({ body: { recipeId } });

  return redirect(`/recipe/${recipeId}`);
};
