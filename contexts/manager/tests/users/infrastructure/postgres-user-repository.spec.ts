import { db } from "@trainix-pkgs/database";
import { User } from "../../../modules/users/domain/user";
import { UserId } from "../../../modules/users/domain/value-objects/user-id";
import { PostgresUserRepository } from "../../../modules/users/infrastructure/postrgres-user-repository";
import { UserName } from "../../../modules/users/domain/value-objects/user-name";
import { UserSurname } from "../../../modules/users/domain/value-objects/user-surname";
import { UserEmail } from "../../../modules/users/domain/value-objects/user-email";
import { UserPasswordHash } from "../../../modules/users/domain/value-objects/user-password-hash";

describe("PostgresUserRepository", () => {
  afterEach(async () => {
    await db.user.deleteMany();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should save a user", async () => {
    const expectedUser = new User({
      id: UserId.random(),
      name: new UserName("Jhon"),
      surname: new UserSurname("Doe"),
      email: new UserEmail("jhon.doe@gmail.com"),
      passwordHash: new UserPasswordHash("987654321"),
    });

    const repository = new PostgresUserRepository();

    await repository.save(expectedUser);
    const user = await repository.search(expectedUser.id.value);

    expect(user).toEqual(expectedUser);
  });
});
