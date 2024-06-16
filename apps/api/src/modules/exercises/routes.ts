import { Hono } from "hono";
import { createExerciseHandler, deleteExerciseHandler } from "./controllers";

export const exercisesApp = new Hono();

exercisesApp.post("/", ...createExerciseHandler);
exercisesApp.delete("/:id", ...deleteExerciseHandler);
