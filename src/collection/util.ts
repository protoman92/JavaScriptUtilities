import { EquatableType } from './../comparable';
import { Try } from './../functional';
import { Nullable, TryResult } from './../type';
import { Numbers } from './../number';

/**
 * Get the element at an index in an Array.
 * @param {T[]} array The Array to get the element from.
 * @param {number} index A number value.
 * @returns {Try} A Try instance.
 */
export function elementAtIndex<T>(array: T[], index: number): Try<T> {
  if (array.length <= index || index < 0) {
    return Try.failure(`No element at index ${index} for array ${array}`);
  } else {
    return Try.success(array[index]);
  }
}

/**
 * Get the first element in an Array.
 * @param {T[]} array The Array to get the element from.
 * @param {Nullable<(value:T} selector An optional selector, which, if defined,
 * determines whether an item passes its check before being returned.
 * @returns {Try} A Try instance.
 */
export function first<T>(
  array: T[], selector: Nullable<(value: T) => boolean> = undefined,
): Try<T> {
  if (selector !== undefined && selector !== null) {
    for (let item of array) {
      if (selector(item)) {
        return Try.success(item);
      }
    }
  } else if (array.length > 0) {
    return elementAtIndex(array, 0);
  }
  
  return Try.failure('Empty array');
}

/**
 * Get the last element in an Array.
 * @param {T[]} array The Array to get the element from.
 * @param {Nullable<(value:T} selector An optional selector, which, if defined,
 * determines whether an item passes its check before being returned.
 * @returns {Try} A Try instance.
 */
export function last<T>(
  array: T[], selector: Nullable<(value: T) => boolean> = undefined,
): Try<T> {
  return first(array.map(v => v).reverse(), selector);
}

/**
 * Get a random element from an Array.
 * @param {T[]} array The Array to get the element from.
 * @returns {Try<T>} A Try instance.
 */
export function randomElement<T>(array: T[]): Try<T> {
  if (array.length === 0) {
    return Try.failure('Empty array');
  } else {
    let index = Numbers.randomBetween(0, array.length - 1);
    return elementAtIndex(array, index);
  }
}

/**
 * Check whether an Array of Equatable contains a specific element.
 * @template T EquatableType.
 * @param {T[]} array An Array of T.
 * @param {T} element A T element.
 * @returns {boolean} A boolean value.
 */
export function containsEquatable<T extends EquatableType>(
  array: T[], element: T
): boolean {
  return array.some(v => v.equals(element));
}

/**
 * If an Array consists of TryResult instances, unwrap each element and filter
 * out undefine/error items.
 * @param {TryResult<T>[]} array An Array of TryResult.
 * @returns {[T]} An Array of T.
 */
export function flatMap<T>(array: TryResult<T>[]): T[] {
  var newArray: T[] = [];

  for (let result of array) {
    try {
      newArray.push(Try.unwrap(result, '').getOrThrow());
    } catch {
      continue;
    }
  }

  return newArray;
}

/**
 * Zip an Array of T Arrays and combine them with a selector function.
 * @template T Generics parameter.
 * @template R Generics parameter.
 * @param {T[][]} arrays An Array of Arrays.
 * @param {(v: T[]) => R} selector Selector function.
 * @returns {Try<R[]>} A Try Array of R.
 */
export function zipAll<T,R>(arrays: T[][], selector: (v: T[]) => R): Try<R[]> {
  return first(arrays.sort((v1, v2) => v1.length - v2.length))
    .map(v => v.length)
    .map(v => Numbers.range(0, v))
    .map(v => v.map(v1 => selector(arrays.map(v2 => v2[v1]))));
}

/**
 * Zip a varargs Array of T Arrays and combine them with a selector function.
 * @template T Generics parameter.
 * @template R Generics parameter.
 * @param {(v: T[]) => R} selector Selector function. 
 * @param {...T[][]} arrays A varargs of Arrays.
 * @returns {Try<R[]>} A Try Array of R.
 */
export function zipVarargs<T,R>(selector: (v: T[]) => R, ...arrays: T[][]): Try<R[]> {
  return zipAll(arrays, selector);
}

/**
 * Zip two Arrays and combine each respective set of elements with a selector
 * function.
 * @template T Generics parameter.
 * @template R Generics parameter.
 * @template U Generics parameter.
 * @param {T[]} a1 An Array of T.
 * @param {R[]} a2 An Array of R.
 * @param {(v1: T, v2: R) => U} selector Selector function.
 * @returns {Try<U[]>} A Try of U Array.
 */
export function zip<T,R,U>(a1: T[], a2: R[], selector: (v1: T, v2: R) => U): Try<U[]> {
  let shorter = first([a1.length, a2.length].sort()).getOrElse(0);
  let indexRange = Numbers.range(0, shorter);
  var result: U[] = [];

  try {
    for (let i of indexRange) {
      result.push(selector(a1[i], a2[i]));
    }

    return Try.success(result);
  } catch (e) {
    return Try.failure(e);
  }
}