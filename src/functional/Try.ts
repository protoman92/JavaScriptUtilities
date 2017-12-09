import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { MaybeConvertibleType, MaybeType, Maybe } from './Maybe';
import { Nullable, Return, TryResult, Types } from './../type';

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
    return Types.isInstance<TryConvertibleType<T>>(object, ['asTry']);
  }

  /**
   * Evaluate a function that can potentially throw an error and wrap the result
   * in a Try.
   * @param  {()=>T} f Transform function.
   * @returns Try A Try instance.
   */
  public static evaluate<T>(f: () => T): Try<T> {
    try {
      return Try.success(f());
    } catch (e) {
      return Try.failure(e);
    }
  }

  public static success<T>(value: TryResult<T>): Try<T> {
    if (Try.isTryConvertible(value)) {
      return new Success(value).flatMap(v => v);
    } else if (Maybe.isMaybeConvertible(value)) {
      return new Success(value).flatMap(v => v.asMaybe());
    } else if (value !== undefined && value !== null) {
      return new Success(value);
    } else {
      return new Failure(new Error(`Value not found`));
    }
  }

  public static failure<T>(error: Error | string): Try<T> {
    if (error instanceof Error) {
      return new Failure(error);
    } else {
      return new Failure(new Error(error));
    }
  }

  protected constructor() {}

  public get value(): Nullable<T> {
    try {
      return this.getOrThrow();
    } catch {
      return undefined;
    }
  }
  
  public get error(): Nullable<Error> {
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

  public getOrElse = (fallback: T): T => {
    try {
      return this.getOrThrow();
    } catch {
      return fallback;
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
   * @param {string[]} members An Array of member properties to check.
   * @returns {Try<R>} A Try instance.
   */
  public castWithProperties<R>(members: string[]): Try<R> {
    return this.flatMap(v => {
      if (Types.isInstance<R>(v, members)) {
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

  public get value(): Nullable<T> {
    return undefined;
  }

  public get error(): Nullable<Error> {
    return this.failure;
  }

  constructor(failure: Error) {
    super();
    this.failure = failure;
  }

  public getOrThrow(): T {
    throw this.error;
  }
}

class Success<T> extends Try<T> {
  private success: T;

  public get value(): Nullable<T> {
    return this.success;
  }

  public get error(): Nullable<Error> {
    return undefined;
  }

  constructor(success: T) {
    super();
    this.success = success;
  }

  public getOrThrow(): T {
    return this.success;
  }
}