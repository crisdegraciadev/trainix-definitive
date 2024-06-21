import { MuscleDTO } from "@trainix/dto";
import { createFactory } from "hono/factory";
import { listMuscles } from "../services";
import { Effect } from "@core/types/result";
import { HTTPException } from "hono/http-exception";

const factory = createFactory();

export const listMusclesHandler = factory.createHandlers(async (c) => {
  const listMusclesResult = await Effect.tryAsync(() => {
    return listMuscles();
  });

  if (!listMusclesResult.isSuccess) {
    throw new HTTPException(500, {
      message: "unexpected database error",
      cause: listMusclesResult.error,
    });
  }

  const muscles: MuscleDTO[] = listMusclesResult.value;
  return c.json(muscles);
});
