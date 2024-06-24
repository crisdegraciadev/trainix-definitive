import { db } from "@trainix-pkgs/database";
import { User } from "../domain/user";
import { UserRepository } from "../domain/user-repository";
import { Uuid } from "../../shared/domain/value-objects/uuid";
import { UserName } from "../domain/value-objects/user-name";
import { UserSurname } from "../domain/value-objects/user-surname";
import { UserEmail } from "../domain/value-objects/user-email";
import { UserPasswordHash } from "../domain/value-objects/user-password-hash";

export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const { id, name, surname, email, passwordHash } = user;

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
