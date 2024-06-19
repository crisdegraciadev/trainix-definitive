import { Exercise, db } from "@trainix/database";

export async function findExercise(id: string): Promise<Exercise | null> {
  return db.exercise.findUnique({
    where: { id },
  });
}
