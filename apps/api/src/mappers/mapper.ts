export interface Mapper<T, R> {
  from(aggregate: T): R;
}
