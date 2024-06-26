import { ExerciseDTO } from "@trainix-pkgs/dto";
import { AggregateRoot } from "../../shared/domain/aggregate-root";
import { ExerciseDescription } from "./value-objects/exercise-description";
import { ExerciseDifficultyId } from "./value-objects/exercise-difficulty-id";
import { ExerciseId } from "./value-objects/exercise-id";
import { ExerciseMuscleId } from "./value-objects/exercise-muscle-id";
import { ExerciseName } from "./value-objects/exercise-name";
import { ExerciseUserId } from "./value-objects/exercise-user-id";

type ExerciseAggregateDto = {
  id: ExerciseId;
  name: ExerciseName;
  description: ExerciseDescription;
  userId: ExerciseUserId;
  difficultyId: ExerciseDifficultyId;
  muscleIds: ExerciseMuscleId[];
};

export class Exercise extends AggregateRoot {
  readonly id: ExerciseId;
  readonly name: ExerciseName;
  readonly description: ExerciseDescription;
  readonly userId: ExerciseUserId;
  readonly difficultyId: ExerciseDifficultyId;
  readonly muscleIds: ExerciseMuscleId[];

  constructor(dto: ExerciseAggregateDto) {
    super();

    const { id, name, description, userId, difficultyId, muscleIds } = dto;

    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.difficultyId = difficultyId;
    this.muscleIds = muscleIds;
  }

  static create(dto: ExerciseAggregateDto): Exercise {
    const exercise = new Exercise(dto);

    return exercise;
  }

  toPrimitives(): ExerciseDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value,
      userId: this.userId.value,
      difficultyId: this.difficultyId.value,
      muscleIds: this.muscleIds.map(({ value }) => value),
    };
  }
}
