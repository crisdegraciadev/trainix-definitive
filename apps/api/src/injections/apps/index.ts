import { GoogleSignInCallbackGetController } from "@controllers/auth/google-sign-in-callback-get-controller";
import { GoogleSignInGetController } from "@controllers/auth/google-sign-in-get-controller";
import { ExercisePutController } from "@controllers/exercises/exercise-put-controller";
import { StatusGetController } from "@controllers/status/status-get-controller";
import { UserPutController } from "@controllers/users/user-put-controller";
import { ContextsDI } from "@injections/contexts";

export type ControllersDI = ReturnType<typeof controllersDI>;

export const controllersDI = (container: ContextsDI) => {
  const { UserCreator } = container;

  return container
    .add("StatusGetController", () => {
      return new StatusGetController();
    })
    .add("UserPutController", () => {
      return new UserPutController(UserCreator);
    })
    .add("ExercisePutController", ({ ExerciseCreator }) => {
      return new ExercisePutController(ExerciseCreator);
    })
    .add("GoogleSignInGetController", () => {
      return new GoogleSignInGetController();
    })
    .add("GoogleSignInCallbackGetController", () => {
      return new GoogleSignInCallbackGetController();
    });
};
