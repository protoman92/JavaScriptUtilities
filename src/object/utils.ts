import {JSObject, Never, Omit} from './../type';

/**
 * Get all entries in a JS-compatible object.
 * @param {JSObject<T> | T[]} object A JS-compatible/Array-like object.
 * @returns {[string, Never<T>][]} An Array of tuples.
 */
export function entries<T>(object: JSObject<T> | T[]): [string, Never<T>][] {
  let keys = Object.keys(object);
  let entryArray: [string, Never<T>][] = [];

  for (let key of keys) {
    entryArray.push([key, (object as any)[key]]);
  }

  return entryArray;
}

export function values<T>(object: JSObject<T> | T[]): Never<T>[] {
  return entries(object).map(([_i, v]) => v);
}

/**
 * Convert a JS-compatible object to a Map.
 * @param {JSObject<T>} object A JS-compatible object.
 * @returns {Map<string, Never<T>>} A Map instance.
 */
export function toMap<T>(object: JSObject<T>): Map<string, Never<T>> {
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
export function deleteKeysUnsafely<T extends {}, K extends keyof T>(
  object: T,
  ...keys: K[]
): Omit<T, K> {
  for (let key of keys) {
    delete object[key];
  }

  return object;
}

/**
 * Deep-clone an object and remove keys from the clone, effectively preventing
 * actual modifications on the original object.
 * @template T Generics parameter.
 * @template K Generics parameter.
 * @param {T} object An Object of type T.
 * @param {...K[]} keys Keys of the object.
 * @returns {Omit<T, K>} The remainder of the object.
 */
export function deleteKeys<T extends {}, K extends keyof T>(
  object: T,
  ...keys: K[]
): Omit<T, K> {
  return deleteKeysUnsafely({...(object as any)}, ...keys);
}

/**
 * Extract some keys from an object into a new object with only those keys.
 * @template T Generics parameter.
 * @template K Generics parameter.
 * @param {T} object A T object.
 * @param {...K[]} keys The keys to be extracted.
 * @returns {Pick<T, K>} The resulting object.
 */
export function extractKeys<T, K extends keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> {
  let newObject = {} as any;

  for (let key of keys) {
    newObject[key] = object[key];
  }

  return newObject;
}
