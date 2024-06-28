import { db } from "@trainix-pkgs/database";
import { PostgresExerciseRelator } from "../../../modules/exercises";
import { ExerciseDifficultyId } from "../../../modules/exercises/domain/value-objects/exercise-difficulty-id";
import { ExerciseMuscleId } from "../../../modules/exercises/domain/value-objects/exercise-muscle-id";
import { ExerciseUserId } from "../../../modules/exercises/domain/value-objects/exercise-user-id";
import { UserId } from "../../../modules/users/domain/value-objects/user-id";

describe("PostgresExerciseRelator", () => {
  beforeEach(async () => {
    await db.exercise.deleteMany();
    await db.user.deleteMany();
  });

  it("should return true if difficulty exists", async () => {
    const user = await db.user.create({
      data: {
        id: UserId.random().value,
        name: "Jhon",
        surname: "Doe",
        email: "jhon.doe@gmail.com",
        passwordHash: "123456789XDS",
      },
    });

    const relator = new PostgresExerciseRelator();

    const isRelatable = await relator.isRelatableWithUser(new ExerciseUserId(user.id));

    expect(isRelatable).toBe(true);
  });

  it("should return false if user doesn't exist", async () => {
    const relator = new PostgresExerciseRelator();

    const isRelatable = await relator.isRelatableWithUser(ExerciseUserId.random());

    expect(isRelatable).toBe(false);
  });

  it("should return true if difficulty exists", async () => {
    const difficulty = await db.difficulty.findUniqueOrThrow({
      where: { value: "easy" },
    });

    const relator = new PostgresExerciseRelator();

    const isRelatable = await relator.isRelatableWithDifficulty(
      new ExerciseDifficultyId(difficulty.id),
    );

    expect(isRelatable).toBe(true);
  });

  it("should return false if difficulty doesn't exist", async () => {
    const relator = new PostgresExerciseRelator();

    const isRelatable = await relator.isRelatableWithDifficulty(ExerciseDifficultyId.random());

    expect(isRelatable).toBe(false);
  });

  it("should return true if muscle exists", async () => {
    const [muslce] = await db.muscle.findMany({ take: 1 });

    const relator = new PostgresExerciseRelator();

    const isRelatable = await relator.isRelatableWithMuscle(new ExerciseMuscleId(muslce.id));

    expect(isRelatable).toBe(true);
  });

  it("should return false if muscle doesn't exist", async () => {
    const relator = new PostgresExerciseRelator();

    const isRelatable = await relator.isRelatableWithDifficulty(ExerciseMuscleId.random());

    expect(isRelatable).toBe(false);
  });
});
