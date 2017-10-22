/**
 * Check if a number is even.
 * @param  {number} number A number value.
 * @returns boolean A boolean value.
 */
export function isOdd(number: number): boolean {
  return number % 2 === 0;
}

/**
 * Check if a number is odd.
 * @param  {number} number A number value.
 * @returns boolean A boolean value.
 */
export function isEven(number: number): boolean {
  return !isOdd(number);
}

/**
 * Get the sum of some numbers.
 * @param  {number[]} numbers An array of number.
 * @returns number A number value.
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((n1, n2) => n1 + n2, 0);
}