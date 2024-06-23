import { StatusGetController } from "@controllers/status-get-controller";
import { UserPutController } from "@controllers/user-put-controller";
import { UserContextDI } from "@injections/contexts/user";

export type ControllersDI = ReturnType<typeof controllersDI>;

export const controllersDI = (container: UserContextDI) => {
  const { UserCreator } = container;

  return container
    .add("StatusGetController", () => {
      return new StatusGetController();
    })
    .add("UserPutController", () => {
      return new UserPutController(UserCreator);
    });
};
