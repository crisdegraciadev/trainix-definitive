import { db } from "@trainix-pkgs/database";

describe("PostgresExerciseRepository", () => {
  beforeEach(async () => {
    await db.exercise.deleteMany();
  });

  it("should save an exercise", () => {});
});
