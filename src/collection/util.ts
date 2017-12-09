import { EquatableType } from './../comparable';
import { Maybe, Try } from './../functional';
import { Nullable, TryResult } from './../type';
import { Numbers } from './../number';

/**
 * Get the element at an index in an Array.
 * @param  {T[]} array The Array to get the element from.
 * @param  {number} index A number value.
 * @returns Maybe A Maybe instance.
 */
export function elementAtIndex<T>(array: T[], index: number): Maybe<T> {
  if (array.length <= index || index < 0) {
    return Maybe.nothing();
  } else {
    return Maybe.some(array[index]);
  }
}

/**
 * Get the first element in an Array.
 * @param  {T[]} array The Array to get the element from.
 * @param  {Nullable<(value:T} selector An optional selector, which, if defined,
 * determines whether an item passes its check before being returned.
 * @returns Maybe A Maybe instance.
 */
export function first<T>(
  array: T[], 
  selector: Nullable<(value: T) => boolean> = undefined
): Maybe<T> {
  if (selector !== undefined && selector !== null) {
    for (let item of array) {
      if (selector(item)) {
        return Maybe.some(item);
      }
    }
  } else if (array.length > 0) {
    return elementAtIndex(array, 0);
  }
  
  return Maybe.nothing();
}

/**
 * Get the last element in an Array.
 * @param  {T[]} array The Array to get the element from.
 * @param  {Nullable<(value:T} selector An optional selector, which, if defined,
 * determines whether an item passes its check before being returned.
 * @returns Maybe A Maybe instance.
 */
export function last<T>(
  array: T[], 
  selector: Nullable<(value: T) => boolean> = undefined
): Maybe<T> {
  return first(array.reverse(), selector);
}

/**
 * Get a random element from an Array.
 * @param  {T[]} array The Array to get the element from.
 * @returns Maybe A Maybe instance.
 */
export function randomElement<T>(array: T[]): Maybe<T> {
  if (array.length === 0) {
    return Maybe.nothing();
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