import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { findAllMuscles } from "../services/find-all";

export async function listMuscles(c: Context<BlankEnv, "/", BlankInput>) {
  const muscles = await findAllMuscles();
  return c.json(muscles);
}
