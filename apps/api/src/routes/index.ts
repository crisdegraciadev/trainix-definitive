import { Router } from "express";
import { glob } from "glob";

export function registerRoutes(router: Router) {
  const routes = glob.sync(`${__dirname}/**/*.route.*`);
  routes.map((route) => register(route, router));
}

async function register(routePath: string, app: Router) {
  const route = require(routePath);
  await route.register(app);
}
