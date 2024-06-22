import { User } from "../domain/user";
import { PasswordHasher } from "../domain/user-password-hasher";
import { UserRepository } from "../domain/user-repository";

export type UserCreatorDto = {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export class UserCreator {
  constructor(
    private repository: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async run(dto: UserCreatorDto) {
    const { password, confirmPassword, ...userData } = dto;

    if (password !== confirmPassword) {
      throw new Error("Provided password and passwordConfirm are not equal");
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = new User({ ...userData, passwordHash });

    return this.repository.save(user);
  }
}
