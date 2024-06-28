import { DIContainer } from "rsdi";
import { userContextDI } from "./user";
import { exerciseContextDI } from "./exercise";

export type ContextsDI = ReturnType<typeof contextsDI>;
export const contextsDI = () => new DIContainer().extend(userContextDI).extend(exerciseContextDI);
