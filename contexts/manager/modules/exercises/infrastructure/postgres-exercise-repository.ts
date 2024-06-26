import { db } from "@trainix-pkgs/database";
import { ExerciseRepository } from "../domain/dependencies/exercise-repository";
import { Exercise } from "../domain/exercise";

export class PostgresExerciseRepository implements ExerciseRepository {
  async save(exercise: Exercise): Promise<void> {
    db.exercise.create({
      data: {
        ...exercise.toPrimitives(),
      },
    });
  }
}
