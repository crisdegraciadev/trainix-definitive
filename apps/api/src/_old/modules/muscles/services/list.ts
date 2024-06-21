import { Muscle, db } from "@trainix/database";

export async function listMuscles(): Promise<Muscle[]> {
  return db.muscle.findMany();
}
