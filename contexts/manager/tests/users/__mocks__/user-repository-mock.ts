import { User } from "../../../modules/users/domain/user";
import { UserRepository } from "../../../modules/users/domain/user-repository";

export class UserRepositoryMock implements UserRepository {
  private saveMock: jest.Mock;

  constructor() {
    this.saveMock = jest.fn();
  }

  async save(user: User): Promise<void> {
    this.saveMock(user);
  }

  assertSaveHaveBeenCalledWith(expected: User): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected);
  }
}
