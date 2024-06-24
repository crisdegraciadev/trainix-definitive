import { InvalidArgumentError } from "../errors/invalid-argument-error";
import { v4, validate } from "uuid";

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUuid(value);
    this.value = value;
  }

  static random(): Uuid {
    return new Uuid(v4());
  }

  private ensureIsValidUuid(value: string): void {
    if (!validate(value)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`,
      );
    }
  }
}
