import { EntityNotFoundError } from "@core/errors";
import { uuidRegex } from "@core/regex/uuid";
import { Effect } from "@core/types/result";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { deleteExercise } from "../services";

const factory = createFactory();

export const deleteExerciseHandler = factory.createHandlers(async (c) => {
  const id = c.req.param("id");

  if (!uuidRegex.test(id)) {
    throw new HTTPException(400, {
      message: "malformed id",
    });
  }

  const deleteExerciseResult = await Effect.tryAsync(() => {
    return deleteExercise(id);
  });

  if (!deleteExerciseResult.isSuccess) {
    const { error } = deleteExerciseResult;

    if (error instanceof EntityNotFoundError) {
      throw new HTTPException(404, {
        message: "exercise not found",
        cause: deleteExerciseResult.error,
      });
    }

    throw new HTTPException(500, {
      message: "unexpected database error",
      cause: deleteExerciseResult.error,
    });
  }

  const { value: exercise } = deleteExerciseResult;

  return c.json(exercise);
});
