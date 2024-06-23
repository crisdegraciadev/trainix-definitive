import { UserCreator, UserCreatorDto } from "../../../modules/users";
import { User } from "../../../modules/users/domain/user";
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

    const dto: UserCreatorDto = {
      id: "ba768462-8fad-4c5d-9a8a-2d2a0133f996",
      name: "Jhon",
      surname: "Doe",
      email: "jhon.doe@gmail.com",
      password: "abcd1234X",
      confirmPassword: "abcd1234X",
    };

    await creator.run(dto);

    const { password, confirmPassword, ...userData } = dto;

    const expectedUser = new User({
      ...userData,
      passwordHash: `hashed_${dto.password}`,
    });

    repository.assertSaveHaveBeenCalledWith(expectedUser);
  });

  it("should hash the password", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorDto = {
      id: "ba768462-8fad-4c5d-9a8a-2d2a0133f996",
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

    const dto: UserCreatorDto = {
      id: "ba768462-8fad-4c5d-9a8a-2d2a0133f996",
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
