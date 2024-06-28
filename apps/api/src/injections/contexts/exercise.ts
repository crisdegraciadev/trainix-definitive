import {
  ExerciseCreator,
  PostgresExerciseRelator,
  PostgresExerciseRepository,
} from "@trainix-contexts/manager";
import { UserContextDI } from "./user";

export type ExerciseContextDI = ReturnType<typeof exerciseContextDI>;

export const exerciseContextDI = (container: UserContextDI) => {
  return container
    .add("PostgresExerciseRepository", () => {
      return new PostgresExerciseRepository();
    })
    .add("PostgresExerciseRelator", () => {
      return new PostgresExerciseRelator();
    })
    .add("ExerciseCreator", ({ PostgresExerciseRepository, PostgresExerciseRelator }) => {
      return new ExerciseCreator(PostgresExerciseRepository, PostgresExerciseRelator);
    });
};
