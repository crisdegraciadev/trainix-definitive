import { Hono } from "hono";
import {
  createExerciseHandler,
  deleteExerciseHandler,
  findExerciseHandler,
  listExercisesHandler,
} from "./controllers";

export const exercisesApp = new Hono();

exercisesApp.post("/", ...createExerciseHandler);
exercisesApp.get("/", ...listExercisesHandler);
exercisesApp.get("/:id", ...findExerciseHandler);
exercisesApp.delete("/:id", ...deleteExerciseHandler);
