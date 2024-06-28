export type AwaitedResult<T> = AwaitedSuccess<T> | AwaitedFailure;

export type AwaitedSuccess<T> = {
  isSuccess: true;
  value: Awaited<T>;
};

export type AwaitedFailure = {
  isSuccess: false;
  error?: unknown;
};

export type Result<T> = Success<T> | Failure;

export type Success<T> = {
  isSuccess: true;
  value: T;
};

export type Failure = {
  isSuccess: false;
  error?: unknown;
};

export class Effect {
  static success<T>(value: T): Success<T> {
    return { isSuccess: true, value };
  }

  static failure(error: unknown): Failure {
    return { isSuccess: false, error };
  }

  static try<T>(f: () => T): Result<T> {
    try {
      const value = f();
      return { isSuccess: true, value };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }

  static async tryAsync<T>(f: () => T): Promise<AwaitedResult<T>> {
    try {
      const value = await f();
      return { isSuccess: true, value };
    } catch (error) {
      return { isSuccess: false, error };
    }
  }
}
