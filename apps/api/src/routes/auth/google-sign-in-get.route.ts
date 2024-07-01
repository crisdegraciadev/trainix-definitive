import { containerDI } from "@injections/index";
import { Router, Request, Response } from "express";

export const register = async (router: Router) => {
  const { GoogleSignInGetController } = containerDI;

  router.get("/auth/google", async (req: Request, res: Response) => {
    await GoogleSignInGetController.run(req, res);
  });
};
