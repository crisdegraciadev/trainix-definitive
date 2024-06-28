import { ExerciseDTO } from "@trainix-pkgs/dto";
import { Effect } from "../../shared/application/result";
import { UseCase } from "../../shared/application/use-case";
import { ExerciseRelator } from "../domain/dependencies/exercise-relator";
import { ExerciseRepository } from "../domain/dependencies/exercise-repository";
import { DifficultyExerciseNotRelatableError } from "../domain/errors/difficulty-exercise-not-relatable-error";
import { ExerciseAlreadyExistsError } from "../domain/errors/exercise-already-exists-error";
import { MuscleExerciseNotRelatableError } from "../domain/errors/muscle-exercise-not-relatable-error";
import { UserExerciseNotRelatableError } from "../domain/errors/user-exercise-not-relatable-error";
import { Exercise } from "../domain/exercise";
import { ExerciseDescription } from "../domain/value-objects/exercise-description";
import { ExerciseDifficultyId } from "../domain/value-objects/exercise-difficulty-id";
import { ExerciseId } from "../domain/value-objects/exercise-id";
import { ExerciseMuscleId } from "../domain/value-objects/exercise-muscle-id";
import { ExerciseName } from "../domain/value-objects/exercise-name";
import { ExerciseUserId } from "../domain/value-objects/exercise-user-id";
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
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly exerciseRelator: ExerciseRelator,
  ) {}

  async run(request: ExerciseCreatorRequest) {
    const { id, name, description, userId, difficultyId, muscleIds } = request;

    const exerciseResult = Effect.try(() => {
      return Exercise.create({
        id: new ExerciseId(id),
        name: new ExerciseName(name),
        description: new ExerciseDescription(description),
        userId: new ExerciseUserId(userId),
        difficultyId: new ExerciseDifficultyId(difficultyId),
        muscleIds: muscleIds.map((muscleId) => new ExerciseMuscleId(muscleId)),
      });
    });

    if (!exerciseResult.isSuccess) {
      return Effect.failure(exerciseResult.error);
    }

    const { value: exercise } = exerciseResult;

    const isRelatableResult = await this.ensureIsRelatable(exercise);

    if (!isRelatableResult.isSuccess) {
      return isRelatableResult;
    }

    const isNotDuplicatedResult = await this.ensureIsNotDuplicated(exercise);

    if (!isNotDuplicatedResult.isSuccess) {
      return isNotDuplicatedResult;
    }

    const saveResult = await Effect.tryAsync(async () => {
      return this.exerciseRepository.save(exercise);
    });

    if (!saveResult.isSuccess) {
      return Effect.failure(new UnknownError());
    }

    return Effect.success(exercise.toPrimitives());
  }

  private async ensureIsRelatable({ userId, difficultyId, muscleIds }: Exercise) {
    const isRelatableWithUser = await this.ensureIsRelatableWithUser(userId);

    if (!isRelatableWithUser) {
      return Effect.failure(new UserExerciseNotRelatableError("User not found"));
    }

    const isRelatableWithDifficulty = await this.ensureIsRelatableWithDifficulty(difficultyId);

    if (!isRelatableWithDifficulty) {
      return Effect.failure(new DifficultyExerciseNotRelatableError("Difficulty not found"));
    }

    const isRelatableWithMuscles = await this.ensureIsRelatableWithMuscles(muscleIds);

    if (!isRelatableWithMuscles) {
      return Effect.failure(new MuscleExerciseNotRelatableError("Muscle not found"));
    }

    return Effect.success(true);
  }

  private async ensureIsRelatableWithUser(userId: ExerciseUserId) {
    return this.exerciseRelator.isRelatableWithUser(userId);
  }

  private async ensureIsRelatableWithDifficulty(difficultyId: ExerciseDifficultyId) {
    return this.exerciseRelator.isRelatableWithDifficulty(difficultyId);
  }

  private async ensureIsRelatableWithMuscles(muscleIds: ExerciseMuscleId[]) {
    const musclesFound = await Promise.all(
      muscleIds.map((muscleId) => this.exerciseRelator.isRelatableWithMuscle(muscleId)),
    );

    return musclesFound.some((found) => !!found);
  }

  private async ensureIsNotDuplicated(exercise: Exercise) {
    return !(await this.exerciseRepository.exists(exercise))
      ? Effect.success(true)
      : Effect.failure(new ExerciseAlreadyExistsError("exercise already exists"));
  }
}
