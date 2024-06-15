import { serve } from "@hono/node-server";
import { ApiRoutes } from "@core/constants/api-routes";
import { musclesApp } from "@modules/muscles/routes";
import { Hono } from "hono";
import { difficultiesApp } from "@modules/difficulties/routes";
import { exercisesApp } from "@modules/exercises/routes";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route(ApiRoutes.MUSCLES, musclesApp);
app.route(ApiRoutes.DIFFICULTIES, difficultiesApp);
app.route(ApiRoutes.EXERCISES, exercisesApp);

const port = process.env.PORT ?? 3000;
const { fetch } = app;

serve({ fetch, port });

console.log(`Server is running on port ${port}`);
