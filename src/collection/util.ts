import { Maybe } from './../functional';
import { Nullable } from './../type';
import { Numbers } from './../number';

/**
 * Get the element at an index in an Array.
 * @param  {T[]} array The Array to get the element from.
 * @param  {number} index A number value.
 * @returns Maybe A Maybe instance.
 */
export let elementAtIndex = (array: any[], index: number): Maybe<any> => {
  if (array.length <= index || index < 0) {
    return Maybe.nothing();
  } else {
    return Maybe.some(array[index]);
  }
};

/**
 * Get the first element in an Array.
 * @param  {T[]} array The Array to get the element from.
 * @param  {Nullable<(value:T} selector An optional selector, which, if defined,
 * determines whether an item passes its check before being returned.
 * @returns Maybe A Maybe instance.
 */
export let first = (
  array: any[], 
  selector: Nullable<(value: any) => boolean> = undefined
): Maybe<any> => {
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
};

/**
 * Get the last element in an Array.
 * @param  {T[]} array The Array to get the element from.
 * @param  {Nullable<(value:T} selector An optional selector, which, if defined,
 * determines whether an item passes its check before being returned.
 * @returns Maybe A Maybe instance.
 */
export let last = (
  array: any[], 
  selector: Nullable<(value: any) => boolean> = undefined
): Maybe<any> => {
  return first(array.reverse(), selector);
};

/**
 * Get a random element from an Array.
 * @param  {T[]} array The Array to get the element from.
 * @returns Maybe A Maybe instance.
 */
export let randomElement = (array: any[]): Maybe<any> => {
  if (array.length === 0) {
    return Maybe.nothing();
  } else {
    let index = Numbers.randomBetween(0, array.length - 1);
    return elementAtIndex(array, index);
  }
};