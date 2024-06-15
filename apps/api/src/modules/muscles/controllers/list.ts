import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { MuscleDTO } from "@trainix/dto";
import { findAllMuscles } from "../services";

export async function listMuscles(c: Context<BlankEnv, "/", BlankInput>) {
  const muscles: MuscleDTO[] = await findAllMuscles();
  return c.json(muscles);
}
