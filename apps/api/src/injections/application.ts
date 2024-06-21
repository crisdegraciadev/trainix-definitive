import { StatusGetController } from "@controllers/status-get-controller";

export const INJECTION_IDS = {
  StatusGetController: "api.controllers.status-get-controller",
};

export const INJECTIONS = {
  [INJECTION_IDS.StatusGetController]: StatusGetController,
};
