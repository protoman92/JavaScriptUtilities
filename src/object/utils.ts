import { Collections } from './../collection';
import { Try } from './../functional';
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
export function toMap<T>(object: JSObject<T>): Map<string,T> {
  let kvEntries = entries(object).map(v => {
    return Try.unwrap(v[1]).map((v1): [string, T] => [v[0], v1]);
  });

  return new Map(Collections.flatMap(kvEntries));
}

/**
 * Check if an object is not undefined and not null.
 * @param {Nullable<any>} object A nullable object.
 * @returns {boolean} A boolean value.
 */
export function isDefinedAndNotNull(object: Nullable<any>): boolean {
  return object !== undefined && object !== null;
}