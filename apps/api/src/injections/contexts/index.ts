import { DIContainer } from "rsdi";
import { userContextDI } from "./user";

export const contextsDI = () => new DIContainer().extend(userContextDI);

export type ContextDI = ReturnType<typeof contextsDI>;
