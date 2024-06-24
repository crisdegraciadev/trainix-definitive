import { UserCreator } from "@trainix-contexts/manager";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Controller } from "./controller";

export class UserPutController implements Controller {
  constructor(private userCreator: UserCreator) {}

  async run(req: Request, res: Response): Promise<void> {
    await this.userCreator.run({ ...req.body });
    res.status(httpStatus.CREATED).send();
  }
}
