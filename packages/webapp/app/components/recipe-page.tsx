/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/P5OUM0oFuGu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

type RecipePageComponentProps = {
  recipe: {
    name: string;
    description: string;
    imageUrl: string | null;
    ingredients: string[];
    instructions: string[];
    tips: string[];
  };
};

export function RecipePageComponent(props: RecipePageComponentProps) {
  const { recipe } = props;

  return (
    <div className="flex flex-col">
      <section className="bg-muted py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                {recipe.name}
              </h1>
              <p className="text-muted-foreground md:text-lg">
                {recipe.description}
              </p>
              <div className="flex items-center gap-4">
                <Link to="./add">
                  <Button>Add to meal plan</Button>
                </Link>
              </div>
            </div>
            <img
              src={recipe.imageUrl ?? "/failed.webp"}
              width={800}
              height={500}
              alt={recipe.name}
              className="aspect-video rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold">Ingredients</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Instructions</h2>
              <ol className="mt-4 space-y-4 text-muted-foreground">
                {recipe.instructions.map((instruction, index) => (
                  <li key={instruction}>
                    <h3 className="font-medium">{`Step ${index + 1}`}</h3>
                    <p>{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16 lg:py-20 bg-muted">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">Tips and Notes</h2>
            <ul className="space-y-2 text-muted-foreground">
              {recipe.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
