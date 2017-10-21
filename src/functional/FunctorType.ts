export default interface FunctorType<T> {
  map<R>(f: (value: T) => R): ThisType<R>;
}