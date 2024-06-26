import { containerDI } from "@injections/index";
import { Router } from "express";

export const register = async (router: Router) => {
  const { StatusGetController } = containerDI;

  router.get("/status", (req, res) => StatusGetController.run(req, res));
};
