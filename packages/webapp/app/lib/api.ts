import { contract } from "@speisekarte/server/src/api";
import { initClient } from "@ts-rest/core";

export const api = initClient(contract, {
  baseUrl: process.env.BACKEND_URL!,
  baseHeaders: {},
});
