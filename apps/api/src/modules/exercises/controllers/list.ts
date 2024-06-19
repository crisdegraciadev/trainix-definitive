import { Effect } from "@core/types/result";
import { createFactory } from "hono/factory";
import { listExercises } from "../services";
import { HTTPException } from "hono/http-exception";
import { ExerciseDTO } from "@trainix/dto";

const factory = createFactory();

export const listExercisesHandler = factory.createHandlers(async (c) => {
  const listExercisesResult = await Effect.tryAsync(() => {
    return listExercises();
  });

  if (!listExercisesResult.isSuccess) {
    throw new HTTPException(500, {
      message: "unexpected database error",
      cause: listExercisesResult.error,
    });
  }

  const exercises: ExerciseDTO[] = listExercisesResult.value.map(
    ({ description, ...rest }) => {
      return description ? { description, ...rest } : { ...rest };
    },
  );

  return c.json(exercises);
});
