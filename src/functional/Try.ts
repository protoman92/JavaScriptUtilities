import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { MaybeConvertibleType, MaybeType, Maybe } from './Maybe';
import { Indeterminate, Nullable, Return, TryResult, Types } from './../type';

export type TryMap<T,R> = (value: T) => R; 
export type TryFlatMap<T,R> = (value: T) => TryConvertibleType<R>; 

export interface TryConvertibleType<T> extends MaybeConvertibleType<T> {
  
  /**
   * Convert the current object into a Try.
   * @returns Try A Try instance.
   */
  asTry(): Try<T>;
}

export abstract class Try<T> implements 
  TryConvertibleType<T>,
  MaybeType<T>,
  FunctorType<T>, 
  MonadType<T> 
{
  /**
   * Check if an object is convertible to a Try instance.
   * @param {*} object Any object.
   * @returns {object is TryConvertibleType<T>} A boolean value.
   */
  public static isTryConvertible<T>(object: any): object is TryConvertibleType<T> {
    return Types.isInstance<TryConvertibleType<T>>(object, 'asTry');
  }

  /**
   * Evaluate a function that can potentially throw an error and wrap the result
   * in a Try.
   * @param {() => T} f Transform function.
   * @returns {Try} A Try instance.
   */
  public static evaluate<T>(f: () => T): Try<T> {
    try {
      return Try.success(f());
    } catch (e) {
      return Try.failure(e);
    }
  }

  /**
   * Unwrap an object of ambiguous types in order to get its inner value.
   * @param {Return<TryResult<T>>} value A TryResult instance.
   * @param {Error | string} error Error in case the value is invalid.
   * @returns {Try<T>} A Try instance.
   */
  public static unwrap<T>(
    value: Return<TryResult<T>>, error: Nullable<Error | string> = undefined,
  ): Try<T> {
    if (value instanceof Function) {
      try {
        return Try.unwrap(value(), error);
      } catch (e) {
        return Try.failure(e);
      }
    } else if (Try.isTryConvertible(value)) {
      return Try.success(value).flatMap(v => v);
    } else if (Maybe.isMaybeConvertible(value)) {
      return Try.success(value).flatMap(v => v.asMaybe().asTry(error));
    } else if (value !== undefined && value !== null) {
      return Try.success(value);
    } else {
      if (error !== undefined && error !== null) {
        return Try.failure(error);
      } else {
        return Try.failure('Value not available');
      }
    }
  }

  public static success<T>(value: T): Try<T> {
    return new Success(value);
  }

  public static failure<T>(error: Error | string): Try<T> {
    if (error instanceof Error) {
      return new Failure(error);
    } else {
      return new Failure(new Error(error));
    }
  }

  protected constructor() {}

  public get value(): Indeterminate<T> {
    try {
      return this.getOrThrow();
    } catch {
      return undefined;
    }
  }
  
  public get error(): Indeterminate<Error> {
    try {
      this.getOrThrow();
      return undefined;
    } catch (e) {
      return e;
    }
  }

  public asMaybe = (): Maybe<T> => {
    try {
      let value = this.getOrThrow();
      return Maybe.some(value);
    } catch {
      return Maybe.nothing<T>();
    }
  }

  public asTry = (): Try<T> => {
    return this;
  }

  public isSome = (): boolean => {
    return this.isSuccess();
  }

  public isNothing = (): boolean => {
    return !this.isSome();
  }

  public isSuccess = (): boolean => {
    try {
      this.getOrThrow();
      return true;
    } catch {
      return false;
    }
  }
  
  public isFailure = (): boolean => {
    return !this.isSuccess();
  }

  public getOrElse = (fallback: Return<T>): T => {
    try {
      return this.getOrThrow();
    } catch {
      if (fallback instanceof Function) {
        return fallback();
      } else {
        return fallback;
      }
    }
  }

  /**
   * Get a fallback Try if the current Try is failure.
   * @param {Return<TryConvertibleType<T>>} fallback A Return instance.
   * @returns {Try<T>} A Try instance.
   */
  public successOrElse (fallback: Return<TryConvertibleType<T>>): Try<T> {
    if (this.isSuccess()) {
      return this;
    } else {
      if (fallback instanceof Function) {
        return fallback().asTry();
      } else {
        return fallback.asTry();
      }
    }
  }

  public map<R>(f: (value: T) => R): Try<R> {
    try {
      let value = this.getOrThrow();
      return Try.success(f(value));
    } catch (e) {
      return Try.failure(e);
    }
  }

  /**
   * Map an error to another error if available.
   * @param {((e: Error) => Error | string)} f Transform function.
   * @returns {Try<T>} A Try instance.
   */
  public mapError(f: (e: Error) => Error | string): Try<T> {
    if (this.error !== undefined && this.error !== null) {
      try {
        return Try.failure(f(this.error));
      } catch (e) {
        return Try.failure(e);
      }
    } else {
      return this;
    }
  }

  public flatMap<R>(f: (value: T) => TryConvertibleType<R>): Try<R> {
    try {
      return f(this.getOrThrow()).asTry();
    } catch (e) {
      return Try.failure(e);
    }
  }

  /**
   * Cast the inner value to type R.
   * @param {new () => R} typeFn Constructor function for R.
   * @returns {Try<R>} A Try instance.
   */
  public cast<R extends T>(typeFn: new () => R): Try<R> {
    return this.map(v => Types.cast(v, typeFn));
  }

  /**
   * Cast the inner value to type R by checking a list of member properties.
   * @param {...string[]} members Varargs of member properties to check.
   * @returns {Try<R>} A Try instance.
   */
  public castWithProperties<R>(...members: string[]): Try<R> {
    return this.flatMap(v => {
      if (Types.isInstance<R>(v, ...members)) {
        return Try.success(v);
      } else {
        return Try.failure<R>(`Failed to cast ${v} to type with members ${members}`);
      }
    });
  }

  /**
   * Filter the inner value using some selector, and return a failure Try if
   * the value fails to pass the predicate.
   * @returns {Try<T>} A Try instance.
   */
  public filter = (selector: (v: T) => boolean, error: Error | string): Try<T> => {
    return this.flatMap(v => {
      if (selector(v)) {
        return Try.success(v);
      } else {
        return Try.failure(error);
      }
    });
  }

  abstract getOrThrow(): T;
}

class Failure<T> extends Try<T> {
  private failure: Error;

  constructor(failure: Error) {
    super();
    this.failure = failure;
  }

  public getOrThrow(): T {
    throw this.failure;
  }
}

class Success<T> extends Try<T> {
  private success: T;

  constructor(success: T) {
    super();
    this.success = success;
  }

  public getOrThrow(): T {
    return this.success;
  }
}