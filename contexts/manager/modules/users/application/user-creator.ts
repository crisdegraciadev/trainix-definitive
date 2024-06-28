import { UserDTO } from "@trainix-pkgs/dto";
import { Effect } from "../../shared/application/result";
import { UseCase } from "../../shared/application/use-case";
import { UnknownError } from "../../shared/domain/errors";
import { PasswordHasher } from "../domain/dependencies/user-password-hasher";
import { UserRepository } from "../domain/dependencies/user-repository";
import { EmailConflictError, PasswordMissmatchError } from "../domain/errors";
import { User } from "../domain/user";
import { UserEmail } from "../domain/value-objects/user-email";
import { UserId } from "../domain/value-objects/user-id";
import { UserName } from "../domain/value-objects/user-name";
import { UserPasswordHash } from "../domain/value-objects/user-password-hash";
import { UserSurname } from "../domain/value-objects/user-surname";

export type UserCreatorRequest = {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export class UserCreator implements UseCase<UserCreatorRequest, UserDTO> {
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async run(request: UserCreatorRequest) {
    const { password, confirmPassword, ...userData } = request;

    if (password !== confirmPassword) {
      return Effect.failure(
        new PasswordMissmatchError("Provided password and passwordConfirm are not equal"),
      );
    }

    const { id, name, surname, email } = userData;
    const passwordHash = await this.passwordHasher.hash(password);

    const userResult = Effect.try(() => {
      return User.create({
        id: new UserId(id),
        name: new UserName(name),
        surname: new UserSurname(surname),
        email: new UserEmail(email),
        passwordHash: new UserPasswordHash(passwordHash),
      });
    });

    if (!userResult.isSuccess) {
      return Effect.failure(userResult.error);
    }

    const { value: user } = userResult;

    if (await this.repository.exists(user)) {
      return Effect.failure(new EmailConflictError("email already in use"));
    }

    const saveResult = await Effect.tryAsync(async () => this.repository.save(user));

    if (!saveResult.isSuccess) {
      return Effect.failure(new UnknownError());
    }

    return Effect.success(user.toPrimitives());
  }
}
