import { ApiRoutes } from "@core/constants/api-routes";
import { Hono } from "hono";
import { progressionApp } from "./modules/progressions/routes";

export const workoutApp = new Hono();

workoutApp.route(`:id/${ApiRoutes.PROGRESSION}`, progressionApp);
