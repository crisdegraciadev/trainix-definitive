import { Effect } from "@core/types/result";
import { CreateExerciseDTO, ExerciseDTO } from "@trainix/dto";
import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { saveExercise } from "../services";
import { HTTPException } from "hono/http-exception";
import { DatabaseErrors } from "@core/types/error";
import { uuidRegex } from "@core/regex/uuid";

export async function createExercise(c: Context<BlankEnv, "/", BlankInput>) {
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

  const saveExerciseResult = await Effect.tryAsync(() => {
    return saveExercise(dto);
  });

  if (!saveExerciseResult.isSuccess) {
    const { error } = saveExerciseResult;

    if (error instanceof Error) {
      const { message } = error;

      if (message === DatabaseErrors.NOT_UNIQUE) {
        throw new HTTPException(409, {
          message: "exercise with that name is already created",
          cause: saveExerciseResult.error,
        });
      }

      if (message === DatabaseErrors.RELATED_NOT_FOUND) {
        throw new HTTPException(404, {
          message: "entities to relate not found",
          cause: saveExerciseResult.error,
        });
      }
    }

    throw new HTTPException(500, {
      message: "exercise cannot be created",
      cause: saveExerciseResult.error,
    });
  }

  const { description, ...rest } = saveExerciseResult.value;

  const exercise: ExerciseDTO = description
    ? { description, ...rest }
    : { ...rest };

  return c.json(exercise);
}

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
