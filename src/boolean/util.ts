/**
 * Check if a value is true.
 * @param {boolean} value A boolean value.
 * @returns {boolean} A boolean value.
 */
export let isTrue = (value: boolean): boolean => value;

/**
 * Check if a value is false.
 * @param {boolean} value A boolean value.
 * @returns {boolean} A boolean value.
 */
export let isFalse = (value: boolean): boolean => !value;

/**
 * Provide a random boolean.
 * @returns {boolean} A boolean value.
 */
export let random = (): boolean => Math.random() > 0.5;