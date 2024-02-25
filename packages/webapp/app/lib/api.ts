import { contract } from "@speisekarte/server/src/api";

// client.ts
import { initClient } from "@ts-rest/core";

// `contract` is the AppRouter returned by `c.router`
console.log('BACKEND_URL', process.env.BACKEND_URL)
export const api = initClient(contract, {
  baseUrl: process.env.BACKEND_URL!,
  baseHeaders: {},
});
