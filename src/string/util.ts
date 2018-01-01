import { Collections } from './../collection';
import { Numbers } from './../number';

/**
 * Produce a random string of a certain length.
 * @param {number} length A number value.
 * @returns {string} A string value.
 */
export let randomString = (length: number): string => {
  let seed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

  return Numbers
    .range(0, length)
    .map(() => Collections.randomElement(seed))
    .map(value => value.getOrElse(''))
    .join('');
};