import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { TryConvertibleType, Try } from './Try';
import { Nullable, Types } from './../type';

export type MaybeMap<T,R> = (value: T) => R;
export type MaybeFlatMap<T,R> = (value: T) => MaybeConvertibleType<R>;

function isMaybeConvertible<T>(object: any): object is MaybeConvertibleType<T> {
  return Types.isInstance<MaybeConvertibleType<T>>(object, 'asMaybe');
}

export interface MaybeConvertibleType<T> {

  /**
   * Convert the current object to a Maybe instance.
   * @returns Maybe A Maybe instance.
   */
  asMaybe(): Maybe<T>;
}

export interface MaybeType<T> extends MaybeConvertibleType<T> {
  value: Nullable<T>;

  /**
   * Check if there is some value.
   * @returns boolean A boolean value.
   */
  isSome(): boolean;

  /**
   * Check if there is no value available.
   * @returns boolean A boolean value.
   */
  isNothing(): boolean;

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
  public static some<T>(value: MaybeConvertibleType<T> | Nullable<T>): Maybe<T> {
    if (isMaybeConvertible(value)) {
      return new Some(value).flatMap(value => value);
    } else if (value !== undefined) {
      return new Some(value);
    } else {
      return Maybe.nothing();
    }
  }

  public static nothing<T>(): Maybe<T> {
    return new Nothing();
  }

  public get value(): Nullable<T> {
    try {
      return this.getOrThrow();
    } catch {
      return undefined;
    }
  }

  public asMaybe = (): Maybe<T> => {
    return this;
  }

  public asTry = (): Try<T> => {
    try {
      return Try.success(this.getOrThrow());
    } catch (e) {
      return Try.failure(e);
    }
  }

  public isSome = (): boolean => {
    try {
      this.getOrThrow();
      return true;
    } catch (e) {
      return false;
    }
  }

  public isNothing = (): boolean => {
    return !this.isSome();
  }

  public getOrElse = (fallback: T): T => {
    try {
      return this.getOrThrow();
    } catch {
      return fallback;
    }
  }

  public map<R>(f: (value: T) => R): Maybe<R> {
    try {
      let value = this.getOrThrow();
      return Maybe.some(f(value));
    } catch {
      return Maybe.nothing();
    }
  }
  
  public flatMap<R>(f: (value: T) => MaybeConvertibleType<R> | Nullable<R>): Maybe<R> {
    try {
      let value = f(this.getOrThrow());

      if (isMaybeConvertible(value)) {
        return value.asMaybe();
      } else {
        return Maybe.some(value);
      }
    } catch (e) {
      return Maybe.nothing();
    }
  }

  public abstract getOrThrow(): T;
}

class Some<T> extends Maybe<T> {
  private some: T;

  public get value(): Nullable<T> {
    return this.some;
  }

  constructor(some: T) {
    super();
    this.some = some;
  }

  public getOrThrow(): T {
    return this.some;
  }
}

class Nothing<T> extends Maybe<T> {
  private static get unavailableError(): string {
    return 'Value not available';
  }

  public get value(): Nullable<T> {
    return undefined;
  }

  constructor() {
    super();
  }

  public getOrThrow(): T {
    throw new Error(Nothing.unavailableError);
  }
}