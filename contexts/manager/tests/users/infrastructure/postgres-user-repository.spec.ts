import { db } from "@trainix-pkgs/database";
import { User } from "../../../modules/users/domain/user";
import { PostgresUserRepository } from "../../../modules/users/infrastructure/postrgres-user-repository";

describe("PostgresUserRepository", () => {
  afterEach(async () => {
    await db.user.deleteMany();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should save a user", async () => {
    const expectedUser = new User({
      id: "ba768462-8fad-4c5d-9a8a-2d2a0133f996",
      name: "Jhon",
      surname: "Doe",
      email: "jhon.doe@gmail.com",
      passwordHash: "987654321",
    });

    const repository = new PostgresUserRepository();

    await repository.save(expectedUser);
    const user = await repository.search(expectedUser.id);

    expect(user).toEqual(expectedUser);
  });
});
