import { Nullable } from './../type';

export function isInstance<T>(object: Nullable<any>, member: string): object is T {
  if (object !== undefined) {
    return object[member] !== undefined;
  } else {
    return false;
  }
}