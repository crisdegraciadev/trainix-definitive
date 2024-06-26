import { StatusGetController } from "@controllers/status/status-get-controller";
import { UserPutController } from "@controllers/users/user-put-controller";
import { UserContextDI } from "@injections/contexts/user";
import { UserMapper } from "src/mappers/user-mapper";

export type MappersDI = ReturnType<typeof mappersDI>;

export const mappersDI = (container: UserContextDI) => {
  return container.add("UserMapper", () => {
    return new UserMapper();
  });
};

export type ControllersDI = ReturnType<typeof controllersDI>;

export const controllersDI = (container: MappersDI) => {
  const { UserCreator } = container;

  return container
    .add("StatusGetController", () => {
      return new StatusGetController();
    })
    .add("UserPutController", ({ UserMapper }) => {
      return new UserPutController(UserCreator, UserMapper);
    });
};
