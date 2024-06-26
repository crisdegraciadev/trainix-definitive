import { Controller, TypedResponse } from "@controllers/controller";
import { ExerciseCreator } from "@trainix-contexts/manager";
import { ExerciseDTO } from "@trainix-pkgs/dto";
import { Request, Response } from "express";
import httpStatus from "http-status";

export class ExercisePutController implements Controller<ExerciseDTO> {
  constructor(private exerciseCreator: ExerciseCreator) {}

  async run(req: Request, res: Response<TypedResponse<ExerciseDTO>>) {
    const result = await this.exerciseCreator.run(req.body);

    if (!result.isSuccess) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "unknown error",
      });
    }

    const { value: data } = result;

    res.status(httpStatus.CREATED).send({ data });
  }
}
