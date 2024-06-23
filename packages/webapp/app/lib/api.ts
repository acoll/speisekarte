import { getAuth } from "@clerk/remix/ssr.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { contract } from "@speisekarte/server/src/api";
import { initClient } from "@ts-rest/core";

export const getApiClient = async (
  args: LoaderFunctionArgs | ActionFunctionArgs
) => {
  const { getToken, userId } = await getAuth(args);

  if (!userId) {
    throw redirect("/sign-in");
  }

  const token = await getToken();

  return initClient(contract, {
    baseUrl: process.env.BACKEND_URL!,
    baseHeaders: {
      authorization: `Bearer ${token}`,
    },
  });
};
