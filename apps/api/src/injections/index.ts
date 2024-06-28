import { DIContainer } from "rsdi";
import { controllersDI } from "./apps";
import { contextsDI } from "./contexts";

export const containerDI = new DIContainer().extend(contextsDI).extend(controllersDI);
