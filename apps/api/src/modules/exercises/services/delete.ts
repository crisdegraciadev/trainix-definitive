import { DatabaseErrors } from "@core/types/error";
import { Exercise, db } from "@trainix/database";

export async function deleteExercise(id: string): Promise<Exercise> {
  const isFound = await db.exercise.findUnique({ where: { id } });

  if (!isFound) {
    throw new Error(DatabaseErrors.NOT_FOUND);
  }

  return db.exercise.delete({
    where: { id },
  });
}
