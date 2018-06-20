import { Nullable, JSObject } from './../type';

/**
 * Get all entries in a JS-compatible object.
 * @param {JSObject<T>} object A JS-compatible object.
 * @returns {[string, Nullable<T>][]} An Array of tuples.
 */
export function entries<T>(object: JSObject<T>): [string, Nullable<T>][] {
  let keys = Object.keys(object);
  let entryArray: [string, Nullable<T>][] = [];

  for (let key of keys) {
    entryArray.push([key, object[key]]);
  }

  return entryArray;
}

/**
 * Convert a JS-compatible object to a Map.
 * @param {JSObject<T>} object A JS-compatible object.
 * @returns {Map<string, Nullable<T>>} A Map instance.
 */
export function toMap<T>(object: JSObject<T>): Map<string, Nullable<T>> {
  return new Map(entries(object));
}
