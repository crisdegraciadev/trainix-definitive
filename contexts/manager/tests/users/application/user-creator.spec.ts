import { Failure } from "../../../modules/shared/application/result";
import { InvalidArgumentError } from "../../../modules/shared/domain/errors/invalid-argument-error";
import { UserCreator } from "../../../modules/users";
import { UserCreatorRequest } from "../../../modules/users/application/user-creator";
import { EmailConflictError } from "../../../modules/users/domain/errors/email-conflict-error";
import { PasswordMissmatchError } from "../../../modules/users/domain/errors/password-missmatch-error";
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

  const validDto: UserCreatorRequest = {
    id: UserId.random().value,
    name: "Jhon",
    surname: "Doe",
    email: "jhon.doe@gmail.com",
    password: "abcd1234X",
    confirmPassword: "abcd1234X",
  };

  beforeEach(() => {
    repository = new UserRepositoryMock();
    passwordHasher = new PasswordHasherMock();
  });

  it("should create a valid user", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    await creator.run(validDto);

    const { password, confirmPassword, ...userData } = validDto;
    const { id, name, surname, email } = userData;

    const expectedUser = User.create({
      ...userData,
      id: new UserId(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(`hashed_${validDto.password}`),
    });

    repository.assertSaveHaveBeenCalledWith(expectedUser);
  });

  it("should hash the password", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    await creator.run(validDto);

    passwordHasher.assertHashHasBeenCalledWith(validDto.password);
  });

  it("should throw an error if passwords are not the same", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorRequest = {
      ...validDto,
      password: "X1234abcd",
      confirmPassword: "abcd1234X",
    };

    const { isSuccess, error } = (await creator.run(dto)) as Failure;

    expect(isSuccess).toBe(false);
    expect(error).toBeInstanceOf(PasswordMissmatchError);
  });

  it("should throw an error if name has numbers", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorRequest = {
      ...validDto,
      name: "Jh0n",
    };

    const { isSuccess, error } = (await creator.run(dto)) as Failure;

    expect(isSuccess).toBe(false);
    expect(error).toBeInstanceOf(InvalidArgumentError);
  });

  it("should throw an error if surname has numbers", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorRequest = {
      ...validDto,
      surname: "D03",
    };

    const { isSuccess, error } = (await creator.run(dto)) as Failure;

    expect(isSuccess).toBe(false);
    expect(error).toBeInstanceOf(InvalidArgumentError);
  });

  it("should throw an error if email is invalid", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    const dto: UserCreatorRequest = {
      ...validDto,
      email: "cris@com",
    };

    const { isSuccess, error } = (await creator.run(dto)) as Failure;

    expect(isSuccess).toBe(false);
    expect(error).toBeInstanceOf(InvalidArgumentError);
  });

  it("should throw an error if a user with this email already exists", async () => {
    const creator = new UserCreator(repository, passwordHasher);

    await creator.run(validDto);

    jest.spyOn(repository, "exists").mockResolvedValue(true);

    const { isSuccess, error } = (await creator.run(validDto)) as Failure;

    const { password, confirmPassword, ...userData } = validDto;
    const { id, name, surname, email } = userData;

    const expectedUser = User.create({
      ...userData,
      id: new UserId(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(`hashed_${validDto.password}`),
    });

    repository.assertExistsHaveBeenCalledWith(expectedUser);

    expect(isSuccess).toBeFalsy();
    expect(error).toBeInstanceOf(EmailConflictError);
  });
});
