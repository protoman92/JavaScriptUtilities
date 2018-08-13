import { Indeterminate, Nullable } from './../type';

/**
 * Parse integer but ignore NaN.
 * @param {string} object A string value.
 * @param {Indeterminate<number>} [radix=undefined] Radix parameterm.
 * @returns {Indeterminate<number>} A possibly undefined number.
 */
export function parseInteger(object: string, radix: Indeterminate<number> = undefined): Indeterminate<number> {
  try {
    let parsed = parseInt(object, radix);

    if (!isNaN(parsed)) {
      return parsed;
    }
  } catch { }

  return undefined;
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
