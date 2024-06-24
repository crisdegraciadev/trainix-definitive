import { db } from "@trainix-pkgs/database";
import { Uuid } from "../../shared/domain/value-objects/uuid";
import { UniqueConstraintError } from "../../shared/infrastructure/errors/unique-constraint-error";
import { User } from "../domain/user";
import { UserRepository } from "../domain/user-repository";
import { UserEmail } from "../domain/value-objects/user-email";
import { UserName } from "../domain/value-objects/user-name";
import { UserPasswordHash } from "../domain/value-objects/user-password-hash";
import { UserSurname } from "../domain/value-objects/user-surname";

export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const { id, name, surname, email, passwordHash } = user;

    const isFound = await db.user.findUnique({ where: { email: email.value } });

    if (isFound) {
      throw new UniqueConstraintError(
        `unique constraint violation error { email :<${email.value}> }`,
      );
    }

    await db.user.create({
      data: {
        id: id.value,
        name: name.value,
        surname: surname.value,
        email: email.value,
        passwordHash: passwordHash.value,
      },
    });
  }

  async search(userId: string): Promise<User> {
    const { id, name, surname, email, passwordHash } =
      await db.user.findUniqueOrThrow({
        where: { id: userId },
      });

    return new User({
      id: new Uuid(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(passwordHash),
    });
  }
}
