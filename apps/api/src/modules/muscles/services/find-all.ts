import { Muscle, db } from "@trainix/database";

export async function findAllMuscles(): Promise<Muscle[]> {
  return db.muscle.findMany();
}
