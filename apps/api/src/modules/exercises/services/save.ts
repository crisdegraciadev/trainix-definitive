import { DatabaseErrors } from "@core/types/error";
import { Exercise, db } from "@trainix/database";
import { CreateExerciseDTO } from "@trainix/dto";

export async function saveExercise(dto: CreateExerciseDTO): Promise<Exercise> {
  const { name } = dto;

  const isExerciseFound = await db.exercise.findUnique({
    where: {
      name,
    },
  });

  if (isExerciseFound) {
    throw new Error(DatabaseErrors.NOT_UNIQUE);
  }

  const { userId } = dto;

  const isUserFound = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserFound) {
    throw new Error(DatabaseErrors.RELATED_NOT_FOUND);
  }

  const { difficultyId } = dto;

  const isDifficultyFound = await db.difficulty.findUnique({
    where: {
      id: difficultyId,
    },
  });

  if (!isDifficultyFound) {
    throw new Error(DatabaseErrors.RELATED_NOT_FOUND);
  }

  return db.exercise.create({ data: dto });
}
