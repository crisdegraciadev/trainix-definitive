import { DIContainer } from "rsdi";
import { controllersDI, mappersDI } from "./apps";
import { userContextDI } from "./contexts/user";

export const containerDI = new DIContainer()
  .extend(userContextDI)
  .extend(mappersDI)
  .extend(controllersDI);
