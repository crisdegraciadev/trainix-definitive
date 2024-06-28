import { UserDTO } from "@trainix-pkgs/dto";
import { AggregateRoot } from "../../shared/domain/aggregate-root";
import { UserEmail } from "./value-objects/user-email";
import { UserId } from "./value-objects/user-id";
import { UserName } from "./value-objects/user-name";
import { UserPasswordHash } from "./value-objects/user-password-hash";
import { UserSurname } from "./value-objects/user-surname";

type UserAggregateDto = {
  id: UserId;
  name: UserName;
  surname: UserSurname;
  email: UserEmail;
  passwordHash: UserPasswordHash;
};

export class User extends AggregateRoot {
  readonly id: UserId;
  readonly name: UserName;
  readonly surname: UserSurname;
  readonly email: UserEmail;
  readonly passwordHash: UserPasswordHash;

  private constructor(dto: UserAggregateDto) {
    super();

    const { id, name, surname, email, passwordHash } = dto;

    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  static create(dto: UserAggregateDto): User {
    const user = new User(dto);
    return user;
  }

  static fromPrimitives(dto: UserDTO & { passwordHash: string }) {
    const { id, name, surname, email, passwordHash } = dto;

    return this.constructor({
      id: new UserId(id),
      name: new UserName(name),
      surname: new UserSurname(surname),
      email: new UserEmail(email),
      passwordHash: new UserPasswordHash(passwordHash),
    });
  }

  toPrimitives(): UserDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      surname: this.surname.value,
      email: this.email.value,
    };
  }
}
