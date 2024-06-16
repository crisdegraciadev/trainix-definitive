import { MuscleDTO } from "@trainix/dto";
import { createFactory } from "hono/factory";
import { listMuscles } from "../services";

const factory = createFactory();

export const listMusclesHandler = factory.createHandlers(async (c) => {
  const muscles: MuscleDTO[] = await listMuscles();
  return c.json(muscles);
});
