import { InvalidArgumentError } from "../../../shared/domain/errors/invalid-argument-error";
import { StringValueObject } from "../../../shared/domain/value-objects/string-value-object";

export class UserSurname extends StringValueObject {
  private readonly HAS_NOT_NUMBERS = /\d/;

  constructor(value: string) {
    super(value);
    this.ensureNameHasNotNumbers(value);
  }

  private ensureNameHasNotNumbers(value: string): void {
    if (this.HAS_NOT_NUMBERS.test(value)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`,
      );
    }
  }
}
