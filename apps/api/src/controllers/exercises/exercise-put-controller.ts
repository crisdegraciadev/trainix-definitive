import { Controller, TypedResponse } from "@controllers/controller";
import { ExerciseDTO } from "@trainix-pkgs/dto";
import { Request, Response } from "express";
import httpStatus from "http-status";

export class ExercisePutController implements Controller<ExerciseDTO> {
  async run(req: Request, res: Response<TypedResponse<ExerciseDTO>>) {}
}
