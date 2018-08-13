import { Numbers } from './../number';

function getNumericalTime(time: Date | number): number {
  if (time instanceof Date) {
    return time.getTime();
  } else {
    return time;
  }
}

/**
 * Produce a random Date.
 * @param {Date | number} start The start date/time.
 * @param {Date | number} end The end date/time.
 * @returns {Date} A Date instance.
 */
export function random(start: Date | number, end: Date | number): Date {
  let startTime = getNumericalTime(start);
  let endTime = getNumericalTime(end);
  return new Date(Numbers.randomBetween(startTime, endTime));
}

/**
 * Parse a date string into a Date.
 * @param {string} date A string value.
 * @returns {Date} A Date instance.
 */
export function parse(date: string): Date {
  let result: unknown = Date.parse(date);

  if (result instanceof Date) {
    return result;
  } else if (typeof (result) === 'number') {
    return new Date(result);
  } else {
    return new Date();
  }
}
