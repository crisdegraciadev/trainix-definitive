import { db } from "@trainix-pkgs/database";
import { Uuid } from "../../shared/domain/value-objects/uuid";
import { ExerciseRelator } from "../domain/dependencies/exercise-relator";

export class PostgresExerciseRelator implements ExerciseRelator {
  async isRelatableWithUser(userId: Uuid): Promise<boolean> {
    return !!(await db.user.findUnique({
      where: { id: userId.value },
    }));
  }

  async isRelatableWithDifficulty(difficultyId: Uuid): Promise<boolean> {
    return !!(await db.difficulty.findUnique({
      where: { id: difficultyId.value },
    }));
  }

  async isRelatableWithMuscle(muscleId: Uuid): Promise<boolean> {
    return !!(await db.muscle.findUnique({
      where: { id: muscleId.value },
    }));
  }
}
