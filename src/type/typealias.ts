import {MaybeConvertibleType, TryConvertibleType} from './../functional';

export type Throwable = Error | string;
export type Indeterminate<T> = T | undefined;
export type IndeterminateKV<T> = {[K in keyof T]: Indeterminate<T[K]>};
export type Nullable<T> = Indeterminate<T> | null;
export type NullableKV<T> = {[K in keyof T]: Nullable<T[K]>};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type JSObject<T> = {[key: string]: Nullable<T>};
export type Return<T> = T | (() => T);
export type CustomValueType<
  Object,
  Value,
  K extends keyof Object = keyof Object
> = Omit<Object, K> & {[key in K]: Value};
export type TryResult<T> =
  | Nullable<T>
  | MaybeConvertibleType<T>
  | TryConvertibleType<T>;
export class Ignore {}
export let IGNORE: Ignore = new Ignore();
