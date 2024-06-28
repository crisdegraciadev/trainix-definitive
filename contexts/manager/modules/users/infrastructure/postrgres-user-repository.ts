import { db } from "@trainix-pkgs/database";
import { Uuid } from "../../shared/domain/value-objects/uuid";
import { UserRepository } from "../domain/dependencies/user-repository";
import { User } from "../domain/user";
import { UserEmail } from "../domain/value-objects/user-email";
import { UserName } from "../domain/value-objects/user-name";
import { UserPasswordHash } from "../domain/value-objects/user-password-hash";
import { UserSurname } from "../domain/value-objects/user-surname";

export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const { passwordHash } = user;

    await db.user.create({
      data: {
        ...user.toPrimitives(),
        passwordHash: passwordHash.value,
      },
    });
  }

  async search(userId: string): Promise<User> {
    const { id, name, surname, email, passwordHash } = await db.user.findUniqueOrThrow({
      where: { id: userId },
    });

    return User.create({
      id: new Uuid(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(passwordHash),
    });
  }

  async exists({ id, email }: User): Promise<boolean> {
    const isFound = await db.user.findFirst({
      where: {
        OR: [{ id: id.value }, { email: email.value }],
      },
    });

    return !!isFound;
  }
}
