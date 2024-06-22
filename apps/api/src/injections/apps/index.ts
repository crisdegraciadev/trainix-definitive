import { StatusGetController } from "@controllers/status-get-controller";
import { UserPutController } from "@controllers/user-put-controller";
import { UserContextDI } from "@injections/contexts/user";
import { DIContainer } from "rsdi";

export const controllersDI = (container: UserContextDI) => {
  const { UserCreator } = container;

  return new DIContainer()
    .add("StatusGetController", () => {
      return new StatusGetController();
    })
    .add("UserPutController", () => {
      return new UserPutController(UserCreator);
    });
};
