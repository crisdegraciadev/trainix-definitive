import { containerDI } from "@injections/index";
import { Router, Request, Response } from "express";

export const register = async (router: Router) => {
  const { GoogleSignInCallbackGetController } = containerDI;

  router.get("/auth/google/callback", async (req: Request, res: Response) => {
    await GoogleSignInCallbackGetController.run(req, res);
  });
};
