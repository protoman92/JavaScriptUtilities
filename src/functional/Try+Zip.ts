import {Try, TryConvertibleType} from './Try';

declare module './Try' {
  namespace Try {
    /**
     * Zip all TryConvertibleType in an Array.
     * @template T Generics parameter.
     * @template TC Generics parameter.
     * @template U Generics parameter.
     * @param {TC[]} tries An Array of TryConvertibleType.
     * @param {(values: T[]) => U} selector A Selector function.
     * @returns {Try<U>} A Try instance.
     */
    export function zipAll<T, TC extends TryConvertibleType<T>, U>(
      tries: TC[],
      selector: (values: T[]) => U
    ): Try<U>;
  }
}

Try.zipAll = function<T, TC extends TryConvertibleType<T>, U>(
  tries: TC[],
  selector: (values: T[]) => U
): Try<U> {
  return Try.evaluate(() => selector(tries.map(tc => tc.asTry().getOrThrow())));
};
