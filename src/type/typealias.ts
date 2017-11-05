import { Observable } from 'rxjs';
import { TryConvertibleType } from './../functional';

/// Represent a indexable key-value JS object.
export type JSObject<T> = { [key: string] : T };
export type Nullable<T> = T | undefined;
export type ReactiveResult<T> = T | TryConvertibleType<T> | Observable<T>;