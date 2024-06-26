import { Request, Response } from "express";

export type TypedResponse<T> =
  | {
      data: T;
    }
  | {
      error?: unknown;
      message: string;
    };

export interface Controller<T> {
  run(req: Request, res: Response<TypedResponse<T>>): Promise<any>;
}
