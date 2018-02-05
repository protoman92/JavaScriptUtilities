import { JSObject, Nullable } from './../type';

/**
 * Get all entries in a JS-compatible object.
 * @param {JSObject<T>} object A JS-compatible object.
 * @returns {[string, T][]} An Array of tuples.
 */
export function entries<T>(object: JSObject<T>): [string, T][] {
  let keys = Object.keys(object);
  let entryArray: [string, T][] = [];

  for (let key of keys) {
    let value = object[key];

    if (value !== undefined && value !== null) {
      entryArray.push([key, value]);
    }
  }

  return entryArray;
}

/**
 * Convert a JS-compatible object to a Map.
 * @param {JSObject<T>} object A JS-compatible object.
 * @returns {Map<string, T>} A Map instance.
 */
export function toMap<T>(object: JSObject<T>): Map<string, T> {
  return new Map(entries(object));
}

/**
 * Check if an object is not undefined and not null.
 * @param {Nullable<any>} object A nullable object.
 * @returns {boolean} A boolean value.
 */
export function isDefinedAndNotNull(object: Nullable<any>): boolean {
  return object !== undefined && object !== null;
}