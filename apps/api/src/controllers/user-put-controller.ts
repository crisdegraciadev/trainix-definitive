import { Request, Response } from "express";
import { Controller } from "./controller";
import httpStatus from "http-status";
import { UserCreator } from "@trainix-contexts/manager";

export class UserPutController implements Controller {
  constructor(private userCreator: UserCreator) {}

  async run(req: Request, res: Response): Promise<void> {
    const { id, name, surname, email, password, confirmPassword } = req.body;

    await this.userCreator.run({
      id,
      name,
      surname,
      email,
      password,
      confirmPassword,
    });

    res.status(httpStatus.CREATED).send();
  }
}
