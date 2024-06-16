import { Difficulty, db } from "@trainix/database";

export async function listDifficulties(): Promise<Difficulty[]> {
  return db.difficulty.findMany();
}
