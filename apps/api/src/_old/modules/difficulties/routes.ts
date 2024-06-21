import { Hono } from "hono";
import { listDifficultiesHandler } from "./controllers/list";

export const difficultiesApp = new Hono();

difficultiesApp.get("", ...listDifficultiesHandler);
