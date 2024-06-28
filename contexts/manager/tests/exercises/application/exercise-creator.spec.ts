import {
  ExerciseCreator,
  ExerciseCreatorRequest,
} from "../../../modules/exercises/application/exercise-creator";
import { Exercise } from "../../../modules/exercises/domain/exercise";
import { ExerciseDescription } from "../../../modules/exercises/domain/value-objects/exercise-description";
import { ExerciseDifficultyId } from "../../../modules/exercises/domain/value-objects/exercise-difficulty-id";
import { ExerciseId } from "../../../modules/exercises/domain/value-objects/exercise-id";
import { ExerciseMuscleId } from "../../../modules/exercises/domain/value-objects/exercise-muscle-id";
import { ExerciseName } from "../../../modules/exercises/domain/value-objects/exercise-name";
import { ExerciseUserId } from "../../../modules/exercises/domain/value-objects/exercise-user-id";
import { ExerciseRelatorMock } from "../__mocks__/exercise-relator-mock";
import { ExerciseRepositoryMock } from "../__mocks__/exercise-repository-mock";

describe("ExerciseCreator", () => {
  let repository: ExerciseRepositoryMock;
  let relator: ExerciseRelatorMock;

  const validDto: ExerciseCreatorRequest = {
    id: ExerciseId.random().value,
    name: "Push up",
    description: "Description",
    userId: ExerciseUserId.random().value,
    difficultyId: ExerciseDifficultyId.random().value,
    muscleIds: [ExerciseMuscleId.random().value],
  };

  beforeEach(() => {
    repository = new ExerciseRepositoryMock();
    relator = new ExerciseRelatorMock();
  });

  it("should create a valid exercise", async () => {
    const creator = new ExerciseCreator(repository, relator);

    jest.spyOn(relator, "isRelatableWithUser").mockResolvedValueOnce(true);
    jest.spyOn(relator, "isRelatableWithDifficulty").mockResolvedValueOnce(true);
    jest.spyOn(relator, "isRelatableWithMuscle").mockResolvedValueOnce(true);

    await creator.run(validDto);

    const { id, name, description, userId, difficultyId, muscleIds } = validDto;

    const exercise = Exercise.create({
      id: new ExerciseId(id),
      name: new ExerciseName(name),
      description: new ExerciseDescription(description),
      userId: new ExerciseUserId(userId),
      difficultyId: new ExerciseDifficultyId(difficultyId),
      muscleIds: muscleIds.map((muscleId) => new ExerciseMuscleId(muscleId)),
    });

    repository.assertSaveHaveBeenCalledWith(exercise);
  });

  it("should validate if exercise can be related with user", async () => {
    const creator = new ExerciseCreator(repository, relator);

    await creator.run(validDto);

    const { id, name, description, userId, difficultyId, muscleIds } = validDto;

    const exercise = Exercise.create({
      id: new ExerciseId(id),
      name: new ExerciseName(name),
      description: new ExerciseDescription(description),
      userId: new ExerciseUserId(userId),
      difficultyId: new ExerciseDifficultyId(difficultyId),
      muscleIds: muscleIds.map((muscleId) => new ExerciseMuscleId(muscleId)),
    });

    relator.assertIsRelatableWithUserHaveBeenCalledWith(exercise.userId);
  });

  it("should validate if exercise can be related with difficulty", async () => {
    const creator = new ExerciseCreator(repository, relator);

    jest.spyOn(relator, "isRelatableWithUser").mockResolvedValueOnce(true);

    await creator.run(validDto);

    const { id, name, description, userId, difficultyId, muscleIds } = validDto;

    const exercise = Exercise.create({
      id: new ExerciseId(id),
      name: new ExerciseName(name),
      description: new ExerciseDescription(description),
      userId: new ExerciseUserId(userId),
      difficultyId: new ExerciseDifficultyId(difficultyId),
      muscleIds: muscleIds.map((muscleId) => new ExerciseMuscleId(muscleId)),
    });

    relator.assertIsRelatableWithDifficultyHaveBeenCalledWith(exercise.difficultyId);
  });

  it("should validate if exercise can be related with muscles", async () => {
    const creator = new ExerciseCreator(repository, relator);

    jest.spyOn(relator, "isRelatableWithUser").mockResolvedValueOnce(true);
    jest.spyOn(relator, "isRelatableWithDifficulty").mockResolvedValueOnce(true);

    await creator.run(validDto);

    const { id, name, description, userId, difficultyId, muscleIds } = validDto;

    const exercise = Exercise.create({
      id: new ExerciseId(id),
      name: new ExerciseName(name),
      description: new ExerciseDescription(description),
      userId: new ExerciseUserId(userId),
      difficultyId: new ExerciseDifficultyId(difficultyId),
      muscleIds: muscleIds.map((muscleId) => new ExerciseMuscleId(muscleId)),
    });

    exercise.muscleIds.forEach((muscleId) => {
      relator.assertIsRelatableWithMuscleHaveBeenCalledWith(muscleId);
    });
  });

  it("should check that exercise is not duplicated", async () => {
    const creator = new ExerciseCreator(repository, relator);

    jest.spyOn(relator, "isRelatableWithUser").mockResolvedValueOnce(true);
    jest.spyOn(relator, "isRelatableWithDifficulty").mockResolvedValueOnce(true);
    jest.spyOn(relator, "isRelatableWithMuscle").mockResolvedValueOnce(true);

    await creator.run(validDto);

    const { id, name, description, userId, difficultyId, muscleIds } = validDto;

    const exercise = Exercise.create({
      id: new ExerciseId(id),
      name: new ExerciseName(name),
      description: new ExerciseDescription(description),
      userId: new ExerciseUserId(userId),
      difficultyId: new ExerciseDifficultyId(difficultyId),
      muscleIds: muscleIds.map((muscleId) => new ExerciseMuscleId(muscleId)),
    });

    repository.assertExistsHaveBeenCalledWith(exercise);
  });
});
