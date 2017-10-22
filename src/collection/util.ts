import { Maybe } from './../functional';
import { Nullable } from './../type';
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
 * Check if all elements in an Array satisfy some check.
 * @param  {T[]} array The Array to check.
 * @param  {(value:T)=>boolean} selector Selector functin.
 * @returns boolean A boolean value.
 */
export function all<T>(array: T[], selector: (value: T) => boolean): boolean {
  for (let element of array) {
    try {
      if (!selector(element)) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

/**
 * Check if there is any element in an Array that satisfies some check.
 * @param  {T[]} array The Array to check.
 * @param  {(value:T)=>boolean} selector Selector functin.
 * @returns boolean A boolean value.
 */
export function any<T>(array: T[], selector: (value: T) => boolean): boolean {
  for (let element of array) {
    try {
      if (selector(element)) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
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
  if (selector !== undefined) {
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