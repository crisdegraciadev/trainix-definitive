import { ExerciseRepository } from "../../../modules/exercises/domain/dependencies/exercise-repository";
import { Exercise } from "../../../modules/exercises/domain/exercise";

export class ExerciseRepositoryMock implements ExerciseRepository {
  private saveMock: jest.Mock;
  private existsMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
    this.existsMock = jest.fn();
  }

  async save(exercise: Exercise): Promise<void> {
    this.saveMock(exercise);
  }

  async exists(exercise: Exercise): Promise<boolean> {
    this.existsMock(exercise);
    return false;
  }

  assertSaveHaveBeenCalledWith(expected: Exercise): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  assertExistsHaveBeenCalledWith(expected: Exercise): void {
    expect(this.existsMock).toHaveBeenCalledWith(expected);
  }
}
