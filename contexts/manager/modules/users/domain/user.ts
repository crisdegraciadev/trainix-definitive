export type UserAggregateDto = {
  id: string;
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
};

export class User {
  readonly id: string;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly passwordHash: string;

  constructor(dto: UserAggregateDto) {
    const { id, name, surname, email, passwordHash } = dto;

    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.passwordHash = passwordHash;
  }
}
