import { Return } from '../type';

/**
 * Parse a possible Error into an actual error.
 * @param {(Return<Error | string>)} error A possible error.
 * @returns {Error} An Error instance.
 */
export function parseError(error: Return<Error | string>): Error {
  if (error instanceof Function) {
    return parseError(error());
  } else {
    if (typeof error === 'string') {
      return new Error(error);
    } else {
      return error;
    }
  }
}
