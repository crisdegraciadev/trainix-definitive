import { UserCreator } from "../../../modules/users";
import { UserCreatorRequest } from "../../../modules/users/application/types/user-creator-request";
import { User } from "../../../modules/users/domain/user";
import { UserEmail } from "../../../modules/users/domain/value-objects/user-email";
import { UserId } from "../../../modules/users/domain/value-objects/user-id";
import { UserName } from "../../../modules/users/domain/value-objects/user-name";
import { UserPasswordHash } from "../../../modules/users/domain/value-objects/user-password-hash";
import { UserSurname } from "../../../modules/users/domain/value-objects/user-surname";
import { PasswordHasherMock } from "../__mocks__/password-hasher-mock";
import { UserRepositoryMock } from "../__mocks__/user-repository-mock";

describe("UserCreator", () => {
  let repository: UserRepositoryMock;
  let passwordHasher: PasswordHasherMock;

  beforeEach(() => {
    repository = new UserRepositoryMock();
    passwordHasher = new PasswordHasherMock();
  });

  it("should create a valid user", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorRequest = {
      id: UserId.random().value,
      name: "Jhon",
      surname: "Doe",
      email: "jhon.doe@gmail.com",
      password: "abcd1234X",
      confirmPassword: "abcd1234X",
    };

    await creator.run(dto);

    const { password, confirmPassword, ...userData } = dto;
    const { id, name, surname, email } = userData;

    const expectedUser = new User({
      ...userData,
      id: new UserId(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(`hashed_${dto.password}`),
    });

    repository.assertSaveHaveBeenCalledWith(expectedUser);
  });

  it("should hash the password", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorRequest = {
      id: UserId.random().value,
      name: "Jhon",
      surname: "Doe",
      email: "jhon.doe@gmail.com",
      password: "abcd1234X",
      confirmPassword: "abcd1234X",
    };

    await creator.run(dto);

    passwordHasher.assertHashHasBeenCalledWith(dto.password);
  });

  it("should throw an error if passwords are not the same", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorRequest = {
      id: UserId.random().value,
      name: "Jhon",
      surname: "Doe",
      email: "jhon.doe@gmail.com",
      password: "X1234abcd",
      confirmPassword: "abcd1234X",
    };

    try {
      await creator.run(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it.todo("should throw an error if a user with this email already exists");
});
