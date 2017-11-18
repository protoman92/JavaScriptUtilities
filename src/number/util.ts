import { Nullable } from './../type';

/**
 * Check if a number is even.
 * @param  {number} number A number value.
 * @returns boolean A boolean value.
 */
export let isEven = (number: number): boolean => {
  return number % 2 === 0;
};

/**
 * Check if a number is odd.
 * @param  {number} number A number value.
 * @returns boolean A boolean value.
 */
export let isOdd = (number: number): boolean => {
  return !isEven(number);
};

/**
 * Get the sum of some numbers.
 * @param  {number[]} numbers An array of number.
 * @returns number A number value.
 */
export let sum = (numbers: number[]): number => {
  return numbers.reduce((n1, n2) => n1 + n2, 0);
};

/**
 * Produce a range of numbers.
 * @param  {number} start The starting value.
 * @param  {number} end The ending value.
 * @param  {number} delta Value change magnitude.
 * @returns number An Array of number.
 */
export let range = (start: number, end: number, delta: number = 1): number[] => {
  let length = Math.floor((end - start) / delta);
  return Array.from<number,number>({ length }, (_, k) => k * delta + start);
};

/**
 * Get a random number between two numbers.
 * @param  {Nullable<number>} lower An optional number that defaults to 0.
 * @param  {number} upper A number value.
 * @returns number A number value.
 */
export let randomBetween = (lower: Nullable<number>, upper: number): number => {
  let lowerBound = lower || 0;
  let diff = upper - lowerBound;
  return Math.floor(diff * Math.random()) + lowerBound;
};