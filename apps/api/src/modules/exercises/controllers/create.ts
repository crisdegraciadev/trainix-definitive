import { uuidRegex } from "@core/regex/uuid";
import { DatabaseErrors } from "@core/types/error";
import { Effect } from "@core/types/result";
import { CreateExerciseDTO, ExerciseDTO } from "@trainix/dto";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { createExercise } from "../services";
import {
  EntityNotUniqueError,
  RelatedEntititesNotFoundError,
} from "@core/errors";

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

    if (error instanceof EntityNotUniqueError) {
      throw new HTTPException(409, {
        message: "exercise with that name is already created",
        cause: createExerciseResult.error,
      });
    }

    if (error instanceof RelatedEntititesNotFoundError) {
      throw new HTTPException(404, {
        message: "entities to relate not found",
        cause: createExerciseResult.error,
      });
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
  const { name, difficultyId, userId, description } = body as CreateExerciseDTO;

  const nameValidations = [!!name, typeof name === "string"];

  const difficultyIdValidations = [
    !!difficultyId,
    typeof name === "string",
    uuidRegex.test(difficultyId),
  ];

  const userIdValidations = [
    !!userId,
    typeof userId === "string",
    uuidRegex.test(userId),
  ];

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
