import { Nullable } from './../type';

/**
 * Check if an object is of a certain type. This check is particular useful for
 * inspecting conformance to an interface.
 * @template T Generic parameter.
 * @param {Nullable<any>} object A nullable object.
 * @param {...string[]} members Varargs of member keys to check existence.
 * @returns {object is T} A boolean value.
 */
export function isInstance<T>(object: Nullable<any>, ...members: string[]): object is T {
  if (object !== undefined && object !== null && members.length > 0) {
    let keys = Object.keys(object);

    /// If the member is null, it is still valid because it technically still
    /// exists as part of the object.
    return members.every(v => keys.indexOf(v) >= 0);
  } else {
    return false;
  }
}

/**
 * Cast an object of type T to type R.
 * @template T Generic parameter.
 * @template R Generic parameter.
 * @param {T} object The object to be cast.
 * @param {new () => R} typeFn Constructor function for R.
 * @returns {R} A R object.
 */
export function cast<T, R extends T>(object: T, typeFn: new () => R): R {
  if ((typeof object).toLowerCase() === typeFn.name.toLowerCase()) {
    return <R>object;
  } else if (object instanceof typeFn) {
    return <R>object;
  } else {
    throw new Error(`Failed to cast to ${typeFn.name}. Actual: ${typeof object}`);
  }
}