import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { ApiRoutes } from "./modules/core/constants/api-routes";
import { muscles } from "./modules/muscles/controller";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route(ApiRoutes.MUSCLES, muscles);

const port = process.env.PORT ?? 3000;
const { fetch } = app;

serve({ fetch, port });

console.log(`Server is running on port ${port}`);
