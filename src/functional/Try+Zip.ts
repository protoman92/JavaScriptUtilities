import { Try, TryConvertibleType } from './Try';

declare module './Try' {
  interface Try<T> {
    zipWith<R, U>(try2: TryConvertibleType<R>, selector: (v1: T, v2: R) => U): Try<U>;
  }

  namespace Try {
    export function zip<T, R, U>(
      try1: TryConvertibleType<T>,
      try2: TryConvertibleType<R>,
      selector: (v1: T, v2: R) => U
    ): Try<U>;

    export function zipAll<T, TC extends TryConvertibleType<T>, U>(
      tries: TC[],
      selector: (values: T[]) => U,
    ): Try<U>;
  }
}

Try.prototype.zipWith = function<R, U>(
  try2: TryConvertibleType<R>,
  selector: (v1: any, v2: R) => U
): Try<U> {
  return this.flatMap(v1 => try2.asTry().map(v2 => selector(v1, v2)));
};

Try.zip = function<T, R, U>(
  try1: TryConvertibleType<T>,
  try2: TryConvertibleType<R>,
  selector: (v1: T, v2: R) => U,
): Try<U> {
  return try1.asTry().zipWith(try2, selector);
};

Try.zipAll = function<T, TC extends TryConvertibleType<T>, U>(
  tries: TC[],
  selector: (values: T[]) => U
): Try<U> {
  return Try.evaluate(() => selector(tries.map(tc => tc.asTry().getOrThrow())));
};