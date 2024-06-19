import { Hono } from "hono";
import {
  createExerciseHandler,
  deleteExerciseHandler,
  findExerciseHandler,
} from "./controllers";

export const exercisesApp = new Hono();

exercisesApp.post("/", ...createExerciseHandler);
exercisesApp.get("/:id", ...findExerciseHandler);
exercisesApp.delete("/:id", ...deleteExerciseHandler);
