export type UserDTO = {
  id: string;
  name: string;
  surname: string;
  email: string;
};

export type CreateUserDTO = UserDTO & {
  password: string;
  passwordConfirm: string;
};
