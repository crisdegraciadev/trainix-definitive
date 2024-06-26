import { DIContainer } from "rsdi";
import { controllersDI } from "./apps";
import { userContextDI } from "./contexts/user";

export const containerDI = new DIContainer()
  .extend(userContextDI)
  .extend(controllersDI);
