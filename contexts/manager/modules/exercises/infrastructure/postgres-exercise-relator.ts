import { db } from "@trainix-pkgs/database";
import { Uuid } from "../../shared/domain/value-objects/uuid";
import { ExerciseRelator } from "../domain/dependencies/exercise-relator";

export class PostgresExerciseRelator implements ExerciseRelator {
  async isRelatableWithUser(userId: Uuid): Promise<boolean> {
    const isFound = await db.user.findFirst({
      where: { id: userId.value },
    });

    return !!isFound;
  }

  async isRelatableWithDifficulty(difficultyId: Uuid): Promise<boolean> {
    const isFound = await db.difficulty.findFirst({
      where: { id: difficultyId.value },
    });

    return !!isFound;
  }

  async isRelatableWithMuscle(muscleId: Uuid): Promise<boolean> {
    const isFound = await db.muscle.findFirst({
      where: { id: muscleId.value },
    });

    return !!isFound;
  }
}
