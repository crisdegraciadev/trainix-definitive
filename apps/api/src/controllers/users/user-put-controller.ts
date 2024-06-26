import {
  EmailConflictError,
  PasswordMissmatchError,
  UserCreator,
} from "@trainix-contexts/manager";
import { Controller } from "../controller";
import { UserMapper } from "src/mappers/user-mapper";
import { Request, Response } from "express";
import httpStatus from "http-status";

export class UserPutController implements Controller {
  constructor(
    private userCreator: UserCreator,
    private userMapper: UserMapper,
  ) {}

  async run(req: Request, res: Response) {
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

    const { value } = result;
    const user = this.userMapper.from(value);

    res.status(httpStatus.CREATED).send({ user });
  }
}
