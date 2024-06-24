import { UserCreator } from "@trainix-contexts/manager";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Controller } from "./controller";

export class UserPutController implements Controller {
  constructor(private userCreator: UserCreator) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      await this.userCreator.run({ ...req.body });
      res.status(httpStatus.CREATED).send();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
