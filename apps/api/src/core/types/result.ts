export type AwaitedResult<T> = AwaitedSuccess<T> | AwaitedError;

export type AwaitedSuccess<T> = {
  isSuccess: true;
  value: Awaited<T>;
};

export type AwaitedError = {
  isSuccess: false;
  error?: unknown;
};

export type Result<T> =
  | {
      isSuccess: true;
      value: T;
    }
  | {
      isSuccess: false;
      error?: unknown;
    };

export class Effect {
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
