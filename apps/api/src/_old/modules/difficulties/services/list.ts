import { Difficulty, db } from "@trainix-pkgs/database";

export async function listDifficulties(): Promise<Difficulty[]> {
  return db.difficulty.findMany();
}
