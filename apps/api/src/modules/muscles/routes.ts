import { Hono } from "hono";
import { listMuscles } from "./controllers";

export const musclesApp = new Hono();

musclesApp.get("", listMuscles);
