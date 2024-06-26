import { User } from "@trainix-contexts/manager/modules/users/domain/user";
import { UserDTO } from "@trainix-pkgs/dto";
import { Mapper } from "./mapper";

export class UserMapper implements Mapper<User, UserDTO> {
  from(aggregate: User) {
    return {
      id: aggregate.id.value,
      name: aggregate.name.value,
      surname: aggregate.email.value,
      email: aggregate.email.value,
    };
  }
}
