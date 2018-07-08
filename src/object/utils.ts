import { JSObject, Nullable, Omit } from './../type';

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

/**
 * Delete some keys from an object. Beware that this function mutates the param
 * object, so be sure to clone it if we want to avoid unwanted references.
 *
 * Since generics are part of the type system and is not supported by JS, there
 * will be some cases whereby we pass in less keys than the actual number of
 * keys we want to exclude. Even so, this is not a cause for worry since the
 * worst that could happen is that a key is still present after it has been
 * marked for omission.
 * @template T Generics parameter.
 * @template K Generics parameter.
 * @param {T} object An Object of type T.
 * @param {...K[]} keys Keys of the object.
 * @returns {Omit<T, K>} The remainder of the object.
 */
export function deleteKeysUnsafely<T, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> {
  for (let key of keys) {
    delete object[key];
  }

  return object;
}

/**
 * Deep-clone an object and remove keys from the clone, effectively preventing
 * actual modifications on the original object. Beware that undefined properties
 * will be converted to null to allow JSON stringification.
 * @template T Generics parameter.
 * @template K Generics parameter.
 * @param {T} object An Object of type T.
 * @param {...K[]} keys Keys of the object.
 * @returns {Omit<T, K>} The remainder of the object.
 */
export function deletingKeys<T, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> {
  let clone = JSON.parse(JSON.stringify(object, (_k, v) => {
    return v === undefined ? null : v;
  }));

  deleteKeysUnsafely(clone, ...keys);
  return clone;
}
