import { UserCreator, UserCreatorDto } from "../../../modules/users";
import { User } from "../../../modules/users/domain/user";
import { PasswordHasher } from "../../../modules/users/domain/user-password-hasher";
import { UserRepository } from "../../../modules/users/domain/user-repository";

describe("UserCreator", () => {
  it("should create a valid user", async () => {
    const repository: UserRepository = {
      save: jest.fn(),
    };

    const mockedPasswordHash = "987654321";

    const passwordHashser: PasswordHasher = {
      hash: jest.fn(async () => mockedPasswordHash),
    };

    const creator = new UserCreator(repository, passwordHashser);

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
      passwordHash: mockedPasswordHash,
    });

    expect(repository.save).toHaveBeenCalledWith(expectedUser);
  });
});
