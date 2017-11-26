import { Nullable } from './../type';

/**
 * Check if an object is of a certain type. This check is particular useful for
 * inspecting conformance to an interface.
 * @template T Generic parameter.
 * @param {Nullable<any>} object A nullable object.
 * @param {...string[]} members Varargs of member keys to check existence.
 * @returns {object is T} A boolean value.
 */
export function isInstance<T>(
  object: Nullable<any>, 
  ...members: string[]
): object is T {
  if (object !== undefined) {
    return members.every(v => object[v] !== undefined);
  } else {
    return false;
  }
}