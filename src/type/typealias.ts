import { MaybeConvertibleType, TryConvertibleType } from './../functional';

/// Represent a indexable key-value JS object.
export type Throwable = Error | string;
export type Indeterminate<T> = T | undefined;
export type IndeterminateKV<T> = { [K in keyof T]: Indeterminate<T[K]> };
export type Nullable<T> = Indeterminate<T> | null;
export type NullableKV<T> = { [K in keyof T]: Nullable<T[K]> };
export type JSObject<T> = { [key: string]: Nullable<T> };
export type Return<T> = T | (() => T);
export type TryResult<T> = Nullable<T> | MaybeConvertibleType<T> | TryConvertibleType<T>;
