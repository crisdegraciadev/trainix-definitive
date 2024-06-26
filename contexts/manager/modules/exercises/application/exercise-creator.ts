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
import { ExerciseRelator } from "../domain/dependencies/exercise-relator";
import { UserExerciseNotRelatableError } from "../domain/errors/user-exercise-not-relatable-error";
import { DifficultyExerciseNotRelatableError } from "../domain/errors/difficulty-exercise-not-relatable-error";
import { MuscleExerciseNotRelatableError } from "../domain/errors/muscle-exercise-not-relatable-error";

export type ExerciseCreatorRequest = {
  id: string;
  name: string;
  description: string;
  userId: string;
  difficultyId: string;
  muscleIds: string[];
};

export class ExerciseCreator implements UseCase<ExerciseCreatorRequest, ExerciseDTO> {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly exerciseRelator: ExerciseRelator,
  ) {}

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

    await this.ensureIsRelatable(exercise);

    const result = await Effect.tryAsync(() => {
      this.exerciseRepository.save(exercise);
    });

    if (!result.isSuccess) {
      return this.handleError(result.error);
    }

    return Effect.success(exercise.toPrimitives());
  }

  private async ensureIsRelatable({ userId, difficultyId, muscleIds }: Exercise) {
    const relateWithUserResult = await Effect.tryAsync(() => {
      return this.exerciseRelator.isRelatableWithUser(userId);
    });

    if (!relateWithUserResult.isSuccess) {
      throw new UserExerciseNotRelatableError();
    }

    const relateWithDifficultyResult = await Effect.tryAsync(() => {
      return this.exerciseRelator.isRelatableWithDifficulty(difficultyId);
    });

    if (!relateWithDifficultyResult.isSuccess) {
      throw new DifficultyExerciseNotRelatableError();
    }

    const relateWithMusclesResult = await Effect.tryAsync(async () => {
      const musclesFound = await Promise.all(
        muscleIds.map((muscleId) => this.exerciseRelator.isRelatableWithMuscle(muscleId)),
      );

      return musclesFound.every((found) => !!found);
    });

    if (!relateWithMusclesResult.isSuccess) {
      throw new MuscleExerciseNotRelatableError();
    }
  }

  private handleError(_error?: unknown) {
    return Effect.failure(new UnknownError());
  }
}
