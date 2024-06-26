import { ExercisePutController } from "@controllers/exercises/exercise-put-controller";
import { StatusGetController } from "@controllers/status/status-get-controller";
import { UserPutController } from "@controllers/users/user-put-controller";
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
    })
    .add("ExercisePutController", () => {
      return new ExercisePutController();
    });
};
