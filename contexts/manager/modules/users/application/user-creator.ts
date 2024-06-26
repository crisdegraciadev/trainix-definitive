import { UserDTO } from "@trainix-pkgs/dto";
import { UnknownError } from "../../shared/domain/errors";
import { Effect } from "../../shared/application/result";
import { UseCase } from "../../shared/application/use-case";
import { UniqueConstraintError } from "../../shared/infrastructure/errors/unique-constraint-error";
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
      return Effect.failure(new PasswordMissmatchError("Provided password and passwordConfirm are not equal"));
    }

    const { id, name, surname, email } = userData;
    const passwordHash = await this.passwordHasher.hash(password);

    const user = User.create({
      id: new UserId(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(passwordHash),
    });

    const saveResult = await Effect.tryAsync(async () => this.repository.save(user));

    if (!saveResult.isSuccess) {
      return this.handleError(saveResult.error);
    }

    return Effect.success(user.toPrimitives());
  }

  private handleError(error?: unknown) {
    if (error instanceof UniqueConstraintError) {
      return Effect.failure(new EmailConflictError("email already in use"));
    }

    return Effect.failure(new UnknownError());
  }
}
