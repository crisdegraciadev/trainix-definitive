import { uuidRegex } from "@core/regex/uuid";
import { Effect } from "@core/types/result";
import { ExerciseDTO } from "@trainix/dto";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { findExercise } from "../services";

const factory = createFactory();

export const findExerciseHandler = factory.createHandlers(async (c) => {
  const id = c.req.param("id");

  if (!uuidRegex.test(id)) {
    throw new HTTPException(400, {
      message: "malformed id",
    });
  }

  const findExerciseResult = await Effect.tryAsync(() => {
    return findExercise(id);
  });

  if (!findExerciseResult.isSuccess) {
    throw new HTTPException(500, {
      message: "unexpected database error",
      cause: findExerciseResult.error,
    });
  }

  const { value } = findExerciseResult;

  if (!value) {
    throw new HTTPException(404, {
      message: "exercise not found",
    });
  }

  const { description, ...rest } = value;

  const exercise: ExerciseDTO = description
    ? { description, ...rest }
    : { ...rest };

  return c.json(exercise);
});
