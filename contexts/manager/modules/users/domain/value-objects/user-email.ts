import { InvalidArgumentError } from "../../../shared/domain/errors/invalid-argument-error";
import { StringValueObject } from "../../../shared/domain/value-objects/string-value-object";
import { validate } from "email-validator";

export class UserEmail extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsValidEmail(value);
  }

  private ensureIsValidEmail(value: string) {
    if (!validate(value)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`,
      );
    }
  }
}
