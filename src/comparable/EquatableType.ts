/**
 * Implement this interface to provide comparisons between two objects.
 */
export default interface EquatableType {
  equals<T>(other: ThisType<T>): boolean;
}