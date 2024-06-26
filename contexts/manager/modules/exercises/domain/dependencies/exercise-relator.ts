import { Relator } from "../../../shared/domain/relator";
import { Uuid } from "../../../shared/domain/value-objects/uuid";

export interface ExerciseRelator extends Relator {
  isRelatableWithUser(userId: Uuid): Promise<boolean>;

  isRelatableWithDifficulty(difficultyId: Uuid): Promise<boolean>;

  isRelatableWithMuscle(muscleId: Uuid): Promise<boolean>;
}
