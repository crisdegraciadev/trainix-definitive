import { PasswordHasher } from "../domain/user-password-hasher";
import bcrypt from "bcrypt";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(value, salt);
  }
}
