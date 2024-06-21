import { Hono } from "hono";
import { listMusclesHandler } from "./controllers";

export const musclesApp = new Hono();

musclesApp.get("", ...listMusclesHandler);
