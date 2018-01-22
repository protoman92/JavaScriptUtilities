import { Observable } from 'rxjs';
import { MaybeConvertibleType, TryConvertibleType } from './../functional';

/// Represent a indexable key-value JS object.
export type Indeterminate<T> = T | undefined;
export type Nullable<T> = Indeterminate<T> | null;
export type JSObject<T> = { [key: string] : Nullable<T> };
export type Return<T> = T | (() => T);
export type TryResult<T> = Nullable<T> | MaybeConvertibleType<T> | TryConvertibleType<T>;
export type ReactiveResult<T> = TryResult<T> | Observable<TryResult<T>>;
