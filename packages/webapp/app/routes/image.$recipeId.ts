import { PrismaClient } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ params }) => {
  const { recipeId } = params;

  if (!recipeId) {
    throw new Response("Recipe id is required", { status: 400 });
  }

  const image = await prisma.image.findUnique({
    where: { id: recipeId },
  });

  if (!image) {
    throw new Response("Image not found", { status: 404 });
  }

  return new Response(image.data, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${recipeId}.png"`,
    },
  });
};
