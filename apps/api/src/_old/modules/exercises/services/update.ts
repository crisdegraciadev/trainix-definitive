import { Exercise, db } from "@trainix/database";
import { UpdateExerciseDTO } from "@trainix/dto";
import {
  EntityNotFoundError,
  EntityNotUniqueError,
  RelatedEntititesNotFoundError,
} from "@core/errors";

export async function updateExercise(
  id: string,
  dto: UpdateExerciseDTO,
): Promise<Exercise> {
  await guardExerciseFound(id);
  await guardExerciseWithSameName(dto);
  await guardUserNotFound(dto);
  await guardDifficultyNotFound(dto);

  return db.exercise.update({
    where: { id },
    data: dto,
  });
}

async function guardExerciseFound(id: string) {
  const isExerciseFound = await db.exercise.findUnique({
    where: {
      id,
    },
  });

  if (!isExerciseFound) {
    throw new EntityNotFoundError();
  }
}

async function guardExerciseWithSameName({ name }: UpdateExerciseDTO) {
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

async function guardUserNotFound({ userId }: UpdateExerciseDTO) {
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

async function guardDifficultyNotFound({ difficultyId }: UpdateExerciseDTO) {
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
