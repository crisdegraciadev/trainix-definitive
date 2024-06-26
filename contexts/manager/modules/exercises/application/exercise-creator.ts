import { ExerciseDTO } from "@trainix-pkgs/dto";
import { Effect } from "../../shared/application/result";
import { UseCase } from "../../shared/application/use-case";
import { Exercise } from "../domain/exercise";
import { ExerciseDescription } from "../domain/value-objects/exercise-description";
import { ExerciseDifficultyId } from "../domain/value-objects/exercise-difficulty-id";
import { ExerciseId } from "../domain/value-objects/exercise-id";
import { ExerciseMuscleId } from "../domain/value-objects/exercise-muscle-id";
import { ExerciseName } from "../domain/value-objects/exercise-name";
import { ExerciseUserId } from "../domain/value-objects/exercise-user-id";
import { ExerciseRepository } from "../domain/dependencies/exercise-repository";
import { UnknownError } from "../../shared/domain/errors";

export type ExerciseCreatorRequest = {
  id: string;
  name: string;
  description: string;
  userId: string;
  difficultyId: string;
  muscleIds: string[];
};

export class ExerciseCreator implements UseCase<ExerciseCreatorRequest, ExerciseDTO> {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async run(request: ExerciseCreatorRequest) {
    const { id, name, description, userId, difficultyId, muscleIds } = request;

    const exercise = Exercise.create({
      id: new ExerciseId(id),
      name: new ExerciseName(name),
      description: new ExerciseDescription(description),
      userId: new ExerciseUserId(userId),
      difficultyId: new ExerciseDifficultyId(difficultyId),
      muscleIds: muscleIds.map((muscleId) => new ExerciseMuscleId(muscleId)),
    });

    const result = await Effect.tryAsync(() => {
      this.exerciseRepository.save(exercise);
    });

    if (!result.isSuccess) {
      return this.handleError(result.error);
    }

    return Effect.success(exercise.toPrimitives());
  }

  private handleError(_error?: unknown) {
    return Effect.failure(new UnknownError());
  }
}
