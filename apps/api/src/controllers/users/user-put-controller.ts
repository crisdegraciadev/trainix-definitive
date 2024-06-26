import {
  EmailConflictError,
  PasswordMissmatchError,
  UserCreator,
} from "@trainix-contexts/manager";
import { Controller, TypedResponse } from "../controller";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserDTO } from "@trainix-pkgs/dto";

export class UserPutController implements Controller<UserDTO> {
  constructor(private userCreator: UserCreator) {}

  async run(req: Request, res: Response<TypedResponse<UserDTO>>) {
    const result = await this.userCreator.run({ ...req.body });

    if (!result.isSuccess) {
      const { error } = result;

      if (error instanceof EmailConflictError) {
        return res.status(httpStatus.CONFLICT).send({
          message: error.message,
        });
      }

      if (error instanceof PasswordMissmatchError) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
          message: error.message,
        });
      }

      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "unknown error",
      });
    }

    const { value: data } = result;

    res.status(httpStatus.CREATED).send({ data });
  }
}
