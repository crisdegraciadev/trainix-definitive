import {
  EntityNotUniqueError,
  RelatedEntititesNotFoundError,
} from "@core/errors";
import { Exercise, db } from "@trainix/database";
import { CreateExerciseDTO } from "@trainix/dto";

export async function createExercise(
  dto: CreateExerciseDTO,
): Promise<Exercise> {
  await guardExerciseExists(dto);
  await guardUserNotFound(dto);
  await guardDifficultyNotFound(dto);

  return db.exercise.create({
    data: dto,
  });
}

async function guardExerciseExists({ name }: CreateExerciseDTO) {
  if (name) {
    const hasSameName = await db.exercise.findUnique({
      where: {
        name,
      },
    });

    if (hasSameName) {
      throw new EntityNotUniqueError();
    }
  }
}

async function guardUserNotFound({ userId }: CreateExerciseDTO) {
  if (userId) {
    const isUserFound = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!isUserFound) {
      throw new RelatedEntititesNotFoundError();
    }
  }
}

async function guardDifficultyNotFound({ difficultyId }: CreateExerciseDTO) {
  if (difficultyId) {
    const isDifficultyFound = await db.difficulty.findUnique({
      where: {
        id: difficultyId,
      },
    });

    if (!isDifficultyFound) {
      throw new RelatedEntititesNotFoundError();
    }
  }
}
