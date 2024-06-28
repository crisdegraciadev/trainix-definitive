import { ExerciseRelator } from "../../../modules/exercises/domain/dependencies/exercise-relator";
import { Uuid } from "../../../modules/shared/domain/value-objects/uuid";

export class ExerciseRelatorMock implements ExerciseRelator {
  private isRelatableWithUserMock: jest.Mock;
  private isRelatableWithDifficultyMock: jest.Mock;
  private isRelatableWithMuscleMock: jest.Mock;

  constructor() {
    this.isRelatableWithUserMock = jest.fn();
    this.isRelatableWithDifficultyMock = jest.fn();
    this.isRelatableWithMuscleMock = jest.fn();
  }

  async isRelatableWithUser(userId: Uuid): Promise<boolean> {
    return this.isRelatableWithUserMock(userId);
  }

  async isRelatableWithDifficulty(difficultyId: Uuid): Promise<boolean> {
    return this.isRelatableWithDifficultyMock(difficultyId);
  }

  async isRelatableWithMuscle(muscleId: Uuid): Promise<boolean> {
    return this.isRelatableWithMuscleMock(muscleId);
  }

  assertIsRelatableWithUserHaveBeenCalledWith(userId: Uuid): void {
    expect(this.isRelatableWithUserMock).toHaveBeenCalledWith(userId);
  }

  assertIsRelatableWithDifficultyHaveBeenCalledWith(difficultyId: Uuid): void {
    expect(this.isRelatableWithDifficultyMock).toHaveBeenCalledWith(difficultyId);
  }

  assertIsRelatableWithMuscleHaveBeenCalledWith(muscleId: Uuid): void {
    expect(this.isRelatableWithMuscleMock).toHaveBeenCalledWith(muscleId);
  }
}
