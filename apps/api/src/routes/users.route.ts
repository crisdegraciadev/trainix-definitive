import { containerDI } from "@injections/index";
import { NextFunction, Request, Response, Router } from "express";
import httpStatus from "http-status";
import { z } from "zod";

export const register = async (router: Router) => {
  const { UserPutController } = containerDI;

  router.put("/users", isValidSchema, (req: Request, res: Response) => {
    UserPutController.run(req, res);
  });
};

const isValidSchema = (req: Request, res: Response, next: NextFunction) => {
  const noNumbers = (val: string) => !/\d/.test(val);

  const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string().refine(noNumbers, {
      message: "Field cannot contain numbers",
    }),
    surname: z.string().refine(noNumbers).refine(noNumbers, {
      message: "Field cannot contain numbers",
    }),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  });

  const { success, error } = userSchema.safeParse(req.body);

  if (!success) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
  }

  next();
};
