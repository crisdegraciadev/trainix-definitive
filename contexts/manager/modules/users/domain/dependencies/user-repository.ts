import { Repository } from "../../../shared/domain/repository";
import { User } from "../user";

export interface UserRepository extends Repository<User> {
  exists(user: User): Promise<boolean>;
}
