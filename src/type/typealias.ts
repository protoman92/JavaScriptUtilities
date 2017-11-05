import { Observable } from 'rxjs';
import { TryConvertibleType } from './../functional';

/// Represent a indexable key-value JS object.
export type JSObject<T> = { [key: string] : T };
export type Nullable<T> = T | undefined;
export type TryResult<T> = T | TryConvertibleType<T>;
export type ReactiveResult<T> = TryResult<T> | Observable<TryResult<T>>;
