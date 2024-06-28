import { Controller, TypedResponse } from "@controllers/controller";
import { ExerciseCreator } from "@trainix-contexts/manager";
import { DifficultyExerciseNotRelatableError } from "@trainix-contexts/manager/modules/exercises/domain/errors/difficulty-exercise-not-relatable-error";
import { ExerciseAlreadyExistsError } from "@trainix-contexts/manager/modules/exercises/domain/errors/exercise-already-exists-error";
import { MuscleExerciseNotRelatableError } from "@trainix-contexts/manager/modules/exercises/domain/errors/muscle-exercise-not-relatable-error";
import { UserExerciseNotRelatableError } from "@trainix-contexts/manager/modules/exercises/domain/errors/user-exercise-not-relatable-error";
import { ExerciseDTO } from "@trainix-pkgs/dto";
import { Request, Response } from "express";
import httpStatus from "http-status";

export class ExercisePutController implements Controller<ExerciseDTO> {
  constructor(private exerciseCreator: ExerciseCreator) {}

  async run(req: Request, res: Response<TypedResponse<ExerciseDTO>>) {
    const result = await this.exerciseCreator.run(req.body);

    if (!result.isSuccess) {
      const { error } = result;

      if (error instanceof UserExerciseNotRelatableError) {
        return res.status(httpStatus.NOT_FOUND).send({
          message: error.message,
          error,
        });
      }

      if (error instanceof DifficultyExerciseNotRelatableError) {
        return res.status(httpStatus.NOT_FOUND).send({
          message: error.message,
          error,
        });
      }

      if (error instanceof MuscleExerciseNotRelatableError) {
        return res.status(httpStatus.NOT_FOUND).send({
          message: error.message,
          error,
        });
      }

      if (error instanceof ExerciseAlreadyExistsError) {
        return res.status(httpStatus.CONFLICT).send({
          message: error.message,
          error,
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
