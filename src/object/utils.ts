import { JSObject, Nullable } from './../type';

/**
 * Get all entries in a JS-compatible object.
 * @param {JSObject<T>} object A JS-compatible object.
 * @returns {[string, T][]} An Array of tuples.
 */
export function entries<T>(object: JSObject<T>): [string, Nullable<T>][] {
  let keys = Object.keys(object);
  var entries: [string, Nullable<T>][] = [];

  for (let key of keys) {
    entries.push([key, object[key]]);
  }

  return entries;
}

/**
 * Convert a JS-compatible object to a Map.
 * @param {JSObject<T>} object A JS-compatible object.
 * @returns {Map<string,T>} A Map instance.
 */
export function toMap<T>(object: JSObject<T>): Map<string,Nullable<T>> {
  return new Map(entries(object));
}