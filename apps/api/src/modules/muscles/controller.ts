import { Hono } from "hono";
import { findAllMuscles } from "./services/find-all";

export const muscles = new Hono();

muscles.get("", async (c) => {
  const muscles = await findAllMuscles();
  return c.json(muscles);
});
