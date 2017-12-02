import { Observable } from 'rxjs';
import { MaybeConvertibleType, TryConvertibleType } from './../functional';

/// Represent a indexable key-value JS object.
export type Nullable<T> = T | undefined | null;
export type JSObject<T> = { [key: string] : Nullable<T> };
export type Return<T> = T | (() => T);
export type TryResult<T> = T | MaybeConvertibleType<T> | TryConvertibleType<T>;
export type ReactiveResult<T> = TryResult<T> | Observable<TryResult<T>>;
