import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { ApiRoutes } from "./modules/core/constants/api-routes";
import { musclesApp } from "./modules/muscles/routes";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route(ApiRoutes.MUSCLES, musclesApp);

const port = process.env.PORT ?? 3000;
const { fetch } = app;

serve({ fetch, port });

console.log(`Server is running on port ${port}`);
