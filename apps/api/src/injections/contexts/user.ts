import {
  BcryptPasswordHasher,
  PostgresUserRepository,
  UserCreator,
} from "@trainix-contexts/manager";
import { DIContainer } from "rsdi";

export type UserContextDI = ReturnType<typeof userContextDI>;

export const userContextDI = () => {
  return new DIContainer()
    .add("PostgresUserRepository", () => {
      return new PostgresUserRepository();
    })
    .add("PasswordHasher", () => {
      return new BcryptPasswordHasher();
    })
    .add("UserCreator", ({ PostgresUserRepository, PasswordHasher }) => {
      return new UserCreator(PostgresUserRepository, PasswordHasher);
    });
};
