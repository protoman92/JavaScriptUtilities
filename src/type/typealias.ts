import {MaybeConvertibleType, TryConvertibleType} from './../functional';

export type Throwable = Error | string;
export type Undefined<T> = T | undefined;
export type UndefinedProp<T> = {[K in keyof T]: Undefined<T[K]>};
export type Null<T> = T | null;
export type NullProp<T> = {[K in keyof T]: Null<T[K]>};
export type Never<T> = Undefined<T> | null;
export type NeverProp<T> = {[K in keyof T]: Never<T[K]>};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type JSObject<T> = {[key: string]: Never<T>};
export type Return<T> = T | (() => T);
/** Change value types for certain keys of an object to a custom type */
export type CustomValueType<
  Object,
  Value,
  K extends keyof Object = keyof Object
> = Omit<Object, K> & {[key in K]: Value};
export type TryResult<T> =
  | Never<T>
  | MaybeConvertibleType<T>
  | TryConvertibleType<T>;
export class Ignore {}
export let IGNORE: Ignore = new Ignore();
