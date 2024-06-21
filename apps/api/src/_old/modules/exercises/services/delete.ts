import { EntityNotFoundError } from "@core/errors";
import { Exercise, db } from "@trainix/database";

export async function deleteExercise(id: string): Promise<Exercise> {
  await guardExerciseNotFound(id);

  return db.exercise.delete({
    where: { id },
  });
}

async function guardExerciseNotFound(id: string) {
  const isFound = await db.exercise.findUnique({ where: { id } });

  if (!isFound) {
    throw new EntityNotFoundError();
  }
}
