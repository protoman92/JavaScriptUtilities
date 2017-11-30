import { Numbers } from './../number';

let getNumericalTime = (time: Date | number): number => {
  if (time instanceof Date) {
    return time.getTime();
  } else {
    return time;
  }
};

/**
 * Produce a random Date. 
 * @param {Date | number} start The start date/time.
 * @param {Date | number} end The end date/time.
 * @returns {Date} A Date instance.
 */
export let random = (start: Date | number, end: Date | number): Date => {
  let startTime = getNumericalTime(start);  
  let endTime = getNumericalTime(end);
  return new Date(Numbers.randomBetween(startTime, endTime));
};