import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { MaybeConvertibleType, MaybeType, Maybe } from './Maybe';
import { Nullable, TryResult, Types } from './../type';

export type TryMap<T,R> = (value: T) => R; 
export type TryFlatMap<T,R> = (value: T) => TryConvertibleType<R>; 

function isTryConvertible<T>(object: any): object is TryConvertibleType<T> {
  return Types.isInstance<TryConvertibleType<T>>(object, 'asTry');
}

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
    if (isTryConvertible(value)) {
      return new Success(value).flatMap(value => value);
    } else {
      return new Success(value);
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