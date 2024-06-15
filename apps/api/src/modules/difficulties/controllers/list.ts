import { DifficultyDTO } from "@trainix/dto";
import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { findAllDifficulties } from "../services";

export async function listDifficulties(c: Context<BlankEnv, "/", BlankInput>) {
  const muscles: DifficultyDTO[] = await findAllDifficulties();
  return c.json(muscles);
}
