import { Request, Response } from "express";
import { Controller } from "./controller";
import httpStatus from "http-status";
import { UserCreator } from "@trainix-contexts/manager";
import { z } from "zod";

export class UserPutController implements Controller {
  constructor(private userCreator: UserCreator) {}

  async run(req: Request, res: Response): Promise<void> {
    const dto = req.body;

    await this.userCreator.run({ ...dto });

    res.status(httpStatus.CREATED).send();
  }
}
