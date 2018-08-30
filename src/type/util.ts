/**
 * Check if an object is of a certain type. This check is particular useful for
 * inspecting conformance to an interface.
 * @template T Generic parameter.
 * @param {*} object Any object.
 * @param {...(keyof T)[]} members Varargs of member keys to check existence.
 * @returns {object is T} A boolean value.
 */
export function isInstance<T>(
  object: any,
  ...members: (keyof T)[]
): object is T {
  if (object !== undefined && object !== null && members.length > 0) {
    let keys = Object.keys(object);

    /// If the member is null, it is still valid because it technically still
    /// exists as part of the object.
    return members.every(v => {
      return (
        (object[v] !== undefined && object[v] !== null) ||
        keys.indexOf(String(v)) >= 0
      );
    });
  } else {
    return false;
  }
}
