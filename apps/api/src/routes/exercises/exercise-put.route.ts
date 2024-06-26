import { containerDI } from "@injections/index";
import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { z } from "zod";

export const register = async (router: Router) => {
  const { ExercisePutController } = containerDI;

  router.put("/exercises", isValidSchema, (req: Request, res: Response) => {
    ExercisePutController.run(req, res);
  });
};

const isValidSchema = (req: Request, res: Response, next: NextFunction) => {
  const exerciseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    userId: z.string().uuid(),
    difficultyId: z.string().uuid(),
    muscleIds: z.array(z.string().uuid()).min(1),
  });

  const { success, error } = exerciseSchema.safeParse(req.body);

  if (!success) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
  }

  next();
};
