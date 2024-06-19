import { Exercise, db } from "@trainix/database";

export async function listExercises(): Promise<Exercise[]> {
  return db.exercise.findMany();
}
