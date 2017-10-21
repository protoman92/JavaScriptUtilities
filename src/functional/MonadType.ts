export default interface MonadType<T> {
  flatMap<R>(f: (value: T) => ThisType<R>): ThisType<R>;
}