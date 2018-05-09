import { Nullable } from './../type';

/**
 * Get the sum of some numbers.
 * @param {number[]} numbers An array of number.
 * @returns {number} A number value.
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((n1, n2) => n1 + n2, 0);
}

/**
 * Produce a range of numbers, not including the end value.
 * @param {number} start The starting value.
 * @param {number} end The exclusive ending value.
 * @param {number} delta Value change magnitude.
 * @returns {number} An Array of number.
 */
export function range(start: number, end: number, delta: number = 1): number[] {
  let length = Math.floor((end - start) / delta);
  return Array.from<number, number>({ length }, (_, k) => k * delta + start);
}

/**
 * Produce an inclusive range of numbers.
 * @param {number} start The starting value.
 * @param {number} end The ending value.
 * @param {number} delta Value change magnitude.
 * @returns {number} An Array of number.
 */
export function rangeInclusive(start: number, end: number, delta: number = 1): number[] {
  return range(start, end + delta, delta);
}

/**
 * Get a random number between two numbers.
 * @param {Nullable<number>} lower An optional number that defaults to 0.
 * @param {number} upper An exclusive number value.
 * @returns {number} A number value.
 */
export function randomBetween(lower: Nullable<number>, upper: number): number {
  let lowerBound = lower || 0;
  let diff = upper - lowerBound;
  return Math.floor(diff * Math.random()) + lowerBound;
}