import { Hono } from "hono";
import {
  createExerciseHandler,
  deleteExerciseHandler,
  findExerciseHandler,
  listExercisesHandler,
} from "./controllers";
import { updateExerciseHandler } from "./controllers/update";

export const exercisesApp = new Hono();

exercisesApp.post("/", ...createExerciseHandler);
exercisesApp.put("/:id", ...updateExerciseHandler);
exercisesApp.get("/", ...listExercisesHandler);
exercisesApp.get("/:id", ...findExerciseHandler);
exercisesApp.delete("/:id", ...deleteExerciseHandler);
