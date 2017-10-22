import { Nullable } from './../type';

export function isInstance<R>(object: Nullable<any>, member: string): object is R {
  if (object !== undefined) {
    return object[member] !== undefined;
  } else {
    return false;
  }
}