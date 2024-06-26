import { Result } from "./result";

export interface UseCase<T, R> {
  run(request: T): Promise<Result<R>>;
}
