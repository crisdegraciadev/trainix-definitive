import { db } from "@trainix-pkgs/database";
import { User } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const { id, name, surname, email, passwordHash } = user;

    await db.user.create({
      data: {
        id,
        name,
        surname,
        email,
        passwordHash,
      },
    });
  }

  async search(userId: string): Promise<User> {
    const { id, name, surname, email, passwordHash } =
      await db.user.findUniqueOrThrow({
        where: { id: userId },
      });

    return new User({ id, name, surname, email, passwordHash });
  }
}
