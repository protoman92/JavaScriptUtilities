import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { MaybeConvertibleType, MaybeType, Maybe } from './Maybe';
import { Nullable, Types } from './../type';

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
   * Evaluate a function that can potentially throw an error and wrap the result
   * in a Try.
   * @param  {()=>T} f Transform function.
   * @returns Try A Try instance.
   */
  static evaluate<T>(f: () => T): Try<T> {
    try {
      return Try.success(f());
    } catch (e) {
      return Try.failure(e);
    }
  }

  static success<T>(value: T): Try<T> {
    return new Success(value);
  }

  static failure<T>(error: Error | string): Try<T> {
    if (error instanceof Error) {
      return new Failure(error);
    } else {
      return new Failure(new Error(error));
    }
  }

  protected constructor() {}

  public asTry(): Try<T> {
    return this;
  }

  public isSuccess(): boolean {
    return this.isSome();
  }

  public isFailure(): boolean {
    return !this.isSuccess();
  }

  public isSome(): boolean {
    return this.asMaybe().isSome();
  }

  public isNothing(): boolean {
    return !this.isNothing();
  }

  public getOrElse(fallback: T): T {
    return this.asMaybe().getOrElse(fallback);
  }

  abstract get value(): Nullable<T>;

  abstract get error(): Nullable<Error>;

  abstract asMaybe(): Maybe<T>;

  abstract getOrThrow(): T;

  public abstract map<R>(f: (value: T) => R): Try<R>;

  public abstract flatMap<R>(f: (value: T) => TryConvertibleType<R> | Nullable<R>): Try<R>;
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

  public asMaybe(): Maybe<T> {
    return Maybe.nothing();
  }

  public getOrThrow(): T {
    throw this.error;
  }

  public map<R>(): Try<R> {
    return Try.failure(this.failure);
  }

  public flatMap<R>(): Try<R> {
    return Try.failure(this.failure);
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

  public asMaybe(): Maybe<T> {
    return Maybe.some(this.success);
  }

  public getOrThrow(): T {
    return this.success;
  }

  public map<R>(f: (value: T) => R): Try<R> {
    try {
      return Try.success(f(this.success));
    } catch (e) {
      return Try.failure<R>(e);
    }
  }

  public flatMap<R>(f: (value: T) => TryConvertibleType<R> | Nullable<R>): Try<R> {
    try {
      let result = f(this.success);

      if (Types.isInstance<TryConvertibleType<R>>(result, 'asTry')) {
        return result.asTry();
      } else {
        return Maybe.some(result).asTry();
      }
    } catch (e) {
      return Try.failure<R>(e);
    }
  }
}