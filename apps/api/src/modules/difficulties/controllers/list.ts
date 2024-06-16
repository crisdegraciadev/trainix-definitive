import { DifficultyDTO } from "@trainix/dto";
import { createFactory } from "hono/factory";
import { listDifficulties } from "../services";

const factory = createFactory();

export const listDifficultiesHandler = factory.createHandlers(async (c) => {
  const muscles: DifficultyDTO[] = await listDifficulties();
  return c.json(muscles);
});
