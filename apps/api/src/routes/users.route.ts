import { containerDI } from "@injections/index";
import { Request, Response, Router } from "express";

export const register = async (router: Router) => {
  const { UserPutController } = containerDI;

  router.put("/users", (req: Request, res: Response) => {
    UserPutController.run(req, res);
  });
};
