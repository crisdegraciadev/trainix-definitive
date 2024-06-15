import { Difficulty, db } from "@trainix/database";

export async function findAllDifficulties(): Promise<Difficulty[]> {
  return db.difficulty.findMany();
}
