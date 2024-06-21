import { DifficultyDTO } from "@trainix/dto";
import { createFactory } from "hono/factory";
import { listDifficulties } from "../services";
import { HTTPException } from "hono/http-exception";
import { Effect } from "@core/types/result";

const factory = createFactory();

export const listDifficultiesHandler = factory.createHandlers(async (c) => {
  const listDifficultiesResult = await Effect.tryAsync(() => {
    return listDifficulties();
  });

  if (!listDifficultiesResult.isSuccess) {
    throw new HTTPException(500, {
      message: "unexpected database error",
      cause: listDifficultiesResult.error,
    });
  }

  const difficulties: DifficultyDTO[] = listDifficultiesResult.value;
  return c.json(difficulties);
});
