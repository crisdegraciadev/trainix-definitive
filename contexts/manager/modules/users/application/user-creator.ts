import { UniqueConstraintError } from "../../shared/infrastructure/errors/unique-constraint-error";
import { EmailConflictError } from "../domain/errors/email-conflict-error";
import { PasswordMissmatchError } from "../domain/errors/password-missmatch-error";
import { User } from "../domain/user";
import { PasswordHasher } from "../domain/user-password-hasher";
import { UserRepository } from "../domain/user-repository";
import { UserEmail } from "../domain/value-objects/user-email";
import { UserId } from "../domain/value-objects/user-id";
import { UserName } from "../domain/value-objects/user-name";
import { UserPasswordHash } from "../domain/value-objects/user-password-hash";
import { UserSurname } from "../domain/value-objects/user-surname";
import { UserCreatorRequest } from "./types/user-creator-request";

export class UserCreator {
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async run(dto: UserCreatorRequest) {
    const { password, confirmPassword, ...userData } = dto;

    if (password !== confirmPassword) {
      throw new PasswordMissmatchError(
        "Provided password and passwordConfirm are not equal",
      );
    }

    const { id, name, surname, email } = userData;
    const passwordHash = await this.passwordHasher.hash(password);

    const user = new User({
      id: new UserId(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(passwordHash),
    });

    try {
      await this.repository.save(user);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown) {
    if (error instanceof UniqueConstraintError) {
      throw new EmailConflictError("email alreay in use");
    }
  }
}
