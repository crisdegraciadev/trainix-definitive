import { db } from "@trainix-pkgs/database";
import { Exercise } from "../../../modules/exercises/domain/exercise";
import { ExerciseId } from "../../../modules/exercises/domain/value-objects/exercise-id";
import { ExerciseName } from "../../../modules/exercises/domain/value-objects/exercise-name";
import { ExerciseDescription } from "../../../modules/exercises/domain/value-objects/exercise-description";
import { ExerciseUserId } from "../../../modules/exercises/domain/value-objects/exercise-user-id";
import { ExerciseDifficultyId } from "../../../modules/exercises/domain/value-objects/exercise-difficulty-id";
import { ExerciseMuscleId } from "../../../modules/exercises/domain/value-objects/exercise-muscle-id";
import { PostgresExerciseRepository } from "../../../modules/exercises";
import { UserId } from "../../../modules/users/domain/value-objects/user-id";

describe("PostgresExerciseRepository", () => {
  beforeEach(async () => {
    await db.exercise.deleteMany({});
    await db.user.deleteMany({});
  });

  it("should save an exercise", async () => {
    const user = await db.user.create({
      data: {
        id: UserId.random().value,
        name: "Jhon",
        surname: "Doe",
        email: "jhon.doe@gmail.com",
        passwordHash: "987654321",
      },
    });

    const difficulty = await db.difficulty.findUnique({
      where: {
        level: 1,
      },
    });

    const [muscle] = await db.muscle.findMany({ take: 1 });

    const expectedExercise = Exercise.create({
      id: ExerciseId.random(),
      name: new ExerciseName("Push Up"),
      description: new ExerciseDescription("Description"),
      userId: new ExerciseUserId(user.id),
      difficultyId: new ExerciseDifficultyId(difficulty!.id),
      muscleIds: [new ExerciseMuscleId(muscle.id)],
    });

    const repository = new PostgresExerciseRepository();

    await repository.save(expectedExercise);
  });

  it("should throw if name or id already has been used", async () => {
    const user = await db.user.create({
      data: {
        id: UserId.random().value,
        name: "Jhon",
        surname: "Doe",
        email: "jhon.doe@gmail.com",
        passwordHash: "987654321",
      },
    });

    const difficulty = await db.difficulty.findUnique({
      where: {
        level: 1,
      },
    });

    const [muscle] = await db.muscle.findMany({ take: 1 });

    const expectedExercise = Exercise.create({
      id: ExerciseId.random(),
      name: new ExerciseName("Push Up"),
      description: new ExerciseDescription("Description"),
      userId: new ExerciseUserId(user.id),
      difficultyId: new ExerciseDifficultyId(difficulty!.id),
      muscleIds: [new ExerciseMuscleId(muscle.id)],
    });

    const repository = new PostgresExerciseRepository();

    await repository.save(expectedExercise);

    expect.assertions(1);

    try {
      await repository.save(expectedExercise);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it("should return false if exercise  does not exist", async () => {
    const user = await db.user.create({
      data: {
        id: UserId.random().value,
        name: "Jhon",
        surname: "Doe",
        email: "jhon.doe@gmail.com",
        passwordHash: "987654321",
      },
    });

    const difficulty = await db.difficulty.findUnique({
      where: {
        level: 1,
      },
    });

    const [muscle] = await db.muscle.findMany({ take: 1 });

    const expectedExercise = Exercise.create({
      id: ExerciseId.random(),
      name: new ExerciseName("Push Up"),
      description: new ExerciseDescription("Description"),
      userId: new ExerciseUserId(user.id),
      difficultyId: new ExerciseDifficultyId(difficulty!.id),
      muscleIds: [new ExerciseMuscleId(muscle.id)],
    });

    const repository = new PostgresExerciseRepository();

    const exists = await repository.exists(expectedExercise);

    expect(exists).toBe(false);
  });

  it("should return true if user exists", async () => {
    const user = await db.user.create({
      data: {
        id: UserId.random().value,
        name: "Jhon",
        surname: "Doe",
        email: "jhon.doe@gmail.com",
        passwordHash: "987654321",
      },
    });

    const difficulty = await db.difficulty.findUnique({
      where: {
        level: 1,
      },
    });

    const [muscle] = await db.muscle.findMany({ take: 1 });

    const expectedExercise = Exercise.create({
      id: ExerciseId.random(),
      name: new ExerciseName("Push Up"),
      description: new ExerciseDescription("Description"),
      userId: new ExerciseUserId(user.id),
      difficultyId: new ExerciseDifficultyId(difficulty!.id),
      muscleIds: [new ExerciseMuscleId(muscle.id)],
    });

    const repository = new PostgresExerciseRepository();

    await repository.save(expectedExercise);
    const exists = await repository.exists(expectedExercise);

    expect(exists).toBe(true);
  });
});
