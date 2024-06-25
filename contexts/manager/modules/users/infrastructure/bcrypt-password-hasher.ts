import bcrypt from "bcrypt";
import { PasswordHasher } from "../domain/dependencies/user-password-hasher";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(value, salt);
  }
}
