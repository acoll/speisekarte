/**
 * v0 by Vercel.
 * @see https://v0.dev/t/lrWthrFiBql
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Link,
  Outlet,
  json,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/lib/api";

export const loader = async () => {
  const response = await api.list();

  if (response.status !== 200) {
    throw new Error("Failed to fetch recipes");
  }

  return json({ recipes: response.body });
};

export default function RecipesList() {
  const { recipes } = useLoaderData<typeof loader>();

  const hasPending = recipes.some((recipe) => recipe.pending);

  const revalidator = useRevalidator();

  useEffect(() => {
    if (hasPending) {
      const timeout = setTimeout(() => {
        revalidator.revalidate();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [hasPending, revalidator]);

  return (
    <>
      <Outlet />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Browse Recipes
            </h1>
            <div className="flex justify-between items-center gap-4">
              <Link to="/">
                <Button>This Week</Button>
              </Link>
              <Link to="/recipes/new">
                <Button>New Recipe</Button>
              </Link>
              <div>
                <Input
                  type="search"
                  placeholder="Search recipes..."
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
}

type RecipeCardProps = {
  recipe: {
    id: string;
    name: string;
    pending: boolean;
  };
};

const RecipeCard = (props: RecipeCardProps) => {
  const { recipe } = props;

  const imageUrl = recipe.pending ? "/pending.webp" : `/image/${recipe.id}`;

  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt={props.recipe.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          {recipe.pending && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs">
              Pending
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {recipe.name ?? " "}
          </h2>
        </div>
      </div>
    </Link>
  );
};
