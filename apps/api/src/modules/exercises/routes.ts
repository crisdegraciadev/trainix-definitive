import { Hono } from "hono";
import { createExercise } from "./controllers";

export const exercisesApp = new Hono();

exercisesApp.post("/", createExercise);
