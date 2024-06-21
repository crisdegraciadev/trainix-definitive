import { StatusGetController } from "@controllers/status-get-controller";
import { INJECTION_IDS } from "@injections/application";
import container from "@injections/index";
import { Router } from "express";

export const register = (router: Router) => {
  const controller: StatusGetController = container.get(
    INJECTION_IDS.StatusGetController,
  );

  router.get("/status", (req, res) => controller.run(req, res));
};
