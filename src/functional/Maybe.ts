import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { TryConvertibleType, Try } from './Try';

export type MaybeMap<T,R> = (value: T) => R;
export type MaybeFlatMap<T,R> = (value: T) => MaybeConvertibleType<R>;

export interface MaybeConvertibleType<T> {

  /**
   * Convert the current object to a Maybe instance.
   * @returns Maybe A Maybe instance.
   */
  asMaybe(): Maybe<T>;
}

export interface MaybeType<T> extends MaybeConvertibleType<T> {
  value: T | undefined;

  /**
   * Get the current value or throw an error if it is not available.
   * @returns T A T instance.
   */
  getOrThrow(): T;

  /**
   * Get the current value or return a fallback if it is not available.
   * @param  {T} fallback A T instance.
   * @returns T A T instance.
   */
  getOrElse(fallback: T): T;
}

export abstract class Maybe<T> implements 
  MaybeType<T>, 
  TryConvertibleType<T>,
  FunctorType<T>, 
  MonadType<T> 
{
  public static some<T>(value: T): Maybe<T> {
    return new Some(value);
  }

  public static nothing<T>(): Maybe<T> {
    return new Nothing();
  }

  public asMaybe(): Maybe<T> {
    return this;
  }

  public isSome(): boolean {
    try {
      this.getOrThrow();
      return true;
    } catch (e) {
      return false;
    }
  }

  public isNothing(): boolean {
    return !this.isSome();
  }

  public abstract asTry(): Try<T>;

  public abstract get value(): T | undefined;

  public abstract getOrThrow(): T;

  public abstract getOrElse(fallback: T): T;

  public abstract map<R>(f: (value: T) => R): Maybe<R>;

  public abstract flatMap<R>(f: (value: T) => MaybeConvertibleType<R>): Maybe<R>;
}

class Some<T> extends Maybe<T> {
  private some: T;

  public get value(): T | undefined {
    return this.some;
  }

  constructor(some: T) {
    super();
    this.some = some;
  }

  public asTry(): Try<T> {
    return Try.success(this.some);
  }

  public getOrThrow(): T {
    return this.some;
  }

  public getOrElse(): T {
    return this.some;
  }

  public map<R>(f: (value: T) => R): Maybe<R> {
    try {
      return Maybe.some(f(this.some));
    } catch (e) {
      return Maybe.nothing();
    }
  }

  public flatMap<R>(f: (value: T) => MaybeConvertibleType<R>): Maybe<R> {
    try {
      return f(this.some).asMaybe();
    } catch (e) {
      return Maybe.nothing();
    }
  }
}

class Nothing<T> extends Maybe<T> {
  private static get unavailableError(): string {
    return 'Value not available';
  }

  public get value(): T | undefined {
    return undefined;
  }

  constructor() {
    super();
  }

  public asTry(): Try<T> {
    return Try.failure(Nothing.unavailableError);
  }

  public getOrThrow(): T {
    throw new Error(Nothing.unavailableError);
  }

  public getOrElse(fallback: T): T {
    return fallback;
  }

  public map<R>(): Maybe<R> {
    return Maybe.nothing();
  }  

  public flatMap<R>(): Maybe<R> {
    return Maybe.nothing();
  }
}