import { JSObject } from './../type';

/**
 * Get all entries in a JS-compatible object.
 * @param {JSObject<any>} object A JS-compatible object.
 * @returns {[string, any][]} An Array of tuples.
 */
export let entries = (object: JSObject<any>): [string, any][] => {
  let keys = Object.keys(object);
  var entries: [string, any][] = [];

  for (let key of keys) {
    if (object.hasOwnProperty(key)) {
      entries.push([key, object[key]]);
    }
  }

  return entries;
};

/**
 * Convert a JS-compatible object to a Map.
 * @param {JSObject<any>} object A JS-compatible object.
 * @returns {Map<string,any>} A Map instance.
 */
export let toMap = (object: JSObject<any>): Map<string,any> => {
  return new Map(entries(object));
};