export type UserDTO = {
  name: string;
  surname: string;
  email: string;
};

export type CreateUserDTO = UserDTO & {
  password: string;
  passwordConfirm: string;
};
