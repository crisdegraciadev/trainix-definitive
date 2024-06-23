import { PasswordHasher } from "../../../modules/users/domain/user-password-hasher";

export class PasswordHasherMock implements PasswordHasher {
  hashMock: jest.Mock;

  constructor() {
    this.hashMock = jest.fn();
  }

  async hash(value: string): Promise<string> {
    this.hashMock(value);
    return `hashed_${value}`;
  }

  assertHashHasBeenCalledWith(expected: string): void {
    expect(this.hashMock).toHaveBeenCalledWith(expected);
  }
}
