import { uuidRegex } from "@core/regex/uuid";
import { Effect } from "@core/types/result";
import { ExerciseDTO, UpdateExerciseDTO } from "@trainix/dto";
import { HTTPException } from "hono/http-exception";
import { updateExercise } from "../services";
import { DatabaseErrors } from "@core/types/error";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const updateExerciseHandler = factory.createHandlers(async (c) => {
  const id = c.req.param("id");

  if (!uuidRegex.test(id)) {
    throw new HTTPException(400, {
      message: "malformed id",
    });
  }

  const parseJsonResult = await Effect.tryAsync(() => {
    return c.req.json<UpdateExerciseDTO>();
  });

  if (!parseJsonResult.isSuccess) {
    throw new HTTPException(400, {
      message: "body not provided",
      cause: parseJsonResult.error,
    });
  }

  const { value: body } = parseJsonResult;

  if (!isValidUpdateExerciseDTO(body)) {
    throw new HTTPException(400, {
      message: "malformed body",
    });
  }

  const dto: UpdateExerciseDTO = body;

  const updateExerciseResult = await Effect.tryAsync(() => {
    return updateExercise(id, dto);
  });

  if (!updateExerciseResult.isSuccess) {
    const { error } = updateExerciseResult;

    if (error instanceof Error) {
      const { message } = error;

      if (message === DatabaseErrors.NOT_FOUND) {
        throw new HTTPException(404, {
          message: "exercise not found",
          cause: updateExerciseResult.error,
        });
      }

      if (message === DatabaseErrors.RELATED_NOT_FOUND) {
        throw new HTTPException(404, {
          message: "entities to relate not found",
          cause: updateExerciseResult.error,
        });
      }

      if (message === DatabaseErrors.NOT_UNIQUE) {
        throw new HTTPException(409, {
          message: "exercise with that name already exists",
          cause: updateExerciseResult.error,
        });
      }
    }

    throw new HTTPException(500, {
      message: "unexpected database error",
      cause: updateExerciseResult.error,
    });
  }

  const { description, ...rest } = updateExerciseResult.value;

  const exercise: ExerciseDTO = description
    ? { description, ...rest }
    : { ...rest };

  return c.json(exercise);
});

function isValidUpdateExerciseDTO(body: unknown): body is UpdateExerciseDTO {
  const { name, difficultyId, userId, description } = body as UpdateExerciseDTO;

  const nameValidations = name ? [typeof name === "string"] : [];

  const difficultyIdValidations = difficultyId
    ? [typeof difficultyId === "string", uuidRegex.test(difficultyId)]
    : [];

  const userIdValidations = userId
    ? [typeof userId === "string", uuidRegex.test(userId)]
    : [];

  const descriptionValidations = description
    ? [typeof description === "string"]
    : [];

  const validations = [
    ...nameValidations,
    ...difficultyIdValidations,
    ...userIdValidations,
    ...descriptionValidations,
  ];

  return validations.every((check) => check === true);
}
