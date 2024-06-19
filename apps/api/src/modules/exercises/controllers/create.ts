import { uuidRegex } from "@core/regex/uuid";
import { DatabaseErrors } from "@core/types/error";
import { Effect } from "@core/types/result";
import { CreateExerciseDTO, ExerciseDTO } from "@trainix/dto";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { createExercise } from "../services";

const factory = createFactory();

export const createExerciseHandler = factory.createHandlers(async (c) => {
  const parseJsonResult = await Effect.tryAsync(() => {
    return c.req.json<CreateExerciseDTO>();
  });

  if (!parseJsonResult.isSuccess) {
    throw new HTTPException(400, {
      message: "body not provided",
      cause: parseJsonResult.error,
    });
  }

  const { value: body } = parseJsonResult;

  if (!isValidCreateExerciseDTO(body)) {
    throw new HTTPException(400, {
      message: "malformed body",
    });
  }

  const dto: CreateExerciseDTO = body;

  const createExerciseResult = await Effect.tryAsync(() => {
    return createExercise(dto);
  });

  if (!createExerciseResult.isSuccess) {
    const { error } = createExerciseResult;

    if (error instanceof Error) {
      const { message } = error;

      if (message === DatabaseErrors.NOT_UNIQUE) {
        throw new HTTPException(409, {
          message: "exercise with that name is already created",
          cause: createExerciseResult.error,
        });
      }

      if (message === DatabaseErrors.RELATED_NOT_FOUND) {
        throw new HTTPException(404, {
          message: "entities to relate not found",
          cause: createExerciseResult.error,
        });
      }
    }

    throw new HTTPException(500, {
      message: "unexpected database error",
      cause: createExerciseResult.error,
    });
  }

  const { description, ...rest } = createExerciseResult.value;

  const exercise: ExerciseDTO = description
    ? { description, ...rest }
    : { ...rest };

  return c.json(exercise);
});

function isValidCreateExerciseDTO(body: unknown): body is CreateExerciseDTO {
  const { name, difficultyId, userId } = body as CreateExerciseDTO;

  const validations = [
    !!name,
    typeof name === "string",
    !!difficultyId,
    typeof difficultyId === "string",
    uuidRegex.test(difficultyId),
    !!userId,
    typeof userId === "string",
    uuidRegex.test(userId),
  ];

  return validations.every((check) => check === true);
}
