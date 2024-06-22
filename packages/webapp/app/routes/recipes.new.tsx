/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KIKuvDrmnCS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { getApiClient } from "~/lib/api";

export default function AddRecipe() {
  const navigate = useNavigate();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          navigate("/recipes");
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Recipe</DialogTitle>
        </DialogHeader>
        <Form className="flex gap-2 flex-col" method="post">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Recipe Scraper
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {`Paste a recipe URL and we'll fetch the ingredients and instructions for you.`}
            </p>
            <Input
              type="url"
              placeholder="Enter recipe URL"
              className="flex-1"
              name="url"
            />
          </div>
          <div className="flex items-center gap-4 justify-end mt-4">
            <Button type="button" onClick={() => navigate("/recipes")}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const action = async (args: ActionFunctionArgs) => {
  const api = await getApiClient(args);

  const { request } = args;
  const formData = await request.formData();
  const url = String(formData.get("url"));

  await api.saveRecipe({ body: { url } });

  return redirect("/recipes");
};
