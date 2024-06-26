export interface Repository<T> {
  save(aggregate: T): Promise<void>;
}
