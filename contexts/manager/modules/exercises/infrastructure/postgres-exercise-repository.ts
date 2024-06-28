import { db } from "@trainix-pkgs/database";
import { ExerciseRepository } from "../domain/dependencies/exercise-repository";
import { Exercise } from "../domain/exercise";

export class PostgresExerciseRepository implements ExerciseRepository {
  async save(exercise: Exercise): Promise<void> {
    const { muscleIds, ...data } = exercise.toPrimitives();

    await db.exercise.create({
      data: {
        ...data,
        muscles: {
          connect: muscleIds.map((id) => ({ id })),
        },
      },
    });
  }

  async exists({ id, name }: Exercise): Promise<boolean> {
    const isFound = await db.exercise.findFirst({
      where: {
        OR: [{ id: id.value }, { name: name.value }],
      },
    });

    return !!isFound;
  }
}
