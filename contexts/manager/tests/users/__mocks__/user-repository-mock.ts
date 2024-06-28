import { UserRepository } from "../../../modules/users/domain/dependencies/user-repository";
import { User } from "../../../modules/users/domain/user";

export class UserRepositoryMock implements UserRepository {
  private saveMock: jest.Mock;
  private existsMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
    this.existsMock = jest.fn();
  }

  async save(user: User): Promise<void> {
    this.saveMock(user);
  }

  async exists(user: User): Promise<boolean> {
    return this.existsMock(user);
  }

  assertSaveHaveBeenCalledWith(expected: User): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }

  assertExistsHaveBeenCalledWith(expected: User): void {
    expect(this.existsMock).toHaveBeenCalledWith(expected);
  }
}
