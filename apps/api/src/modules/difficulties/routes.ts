import { Hono } from "hono";
import { listDifficulties } from "./controllers";

export const difficultiesApp = new Hono();

difficultiesApp.get("", listDifficulties);
