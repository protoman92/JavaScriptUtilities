import { Maybe } from './../functional';
import { Nullable } from './../type';

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
  if (selector != undefined) {
    for (let item of array) {
      if (selector(item)) {
        return Maybe.some(item);
      }
    }
  } else if (array.length > 0) {
    return Maybe.some(array[0]);
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