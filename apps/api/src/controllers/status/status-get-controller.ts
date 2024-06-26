import { Request, Response } from "express";
import httpStatus from "http-status";
import { Controller } from "../controller";

export class StatusGetController implements Controller<{}> {
  async run(_req: Request, res: Response) {
    res.status(httpStatus.OK).send({});
  }
}
