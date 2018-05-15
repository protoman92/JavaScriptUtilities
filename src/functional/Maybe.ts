import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { TryConvertibleType, Try } from './Try';
import { Indeterminate, Nullable, Return, Types } from './../type';

export type MaybeMap<T, R> = (value: T) => R;
export type MaybeFlatMap<T, R> = (value: T) => MaybeConvertibleType<R>;

export interface MaybeConvertibleType<T> {

  /**
   * Convert the current object to a Maybe instance.
   * @returns {Maybe} A Maybe instance.
   */
  asMaybe(): Maybe<T>;
}

export interface MaybeType<T> {
  value: Indeterminate<T>;

  /**
   * Check if there is some value.
   * @returns {boolean} A boolean value.
   */
  isSome(): boolean;

  /**
   * Check if there is no value available.
   * @returns boolean A boolean value.
   */
  isNothing(): boolean;

  /**
   * Get the current value or throw an error if it is not available.
   * @returns {T} A T instance.
   */
  getOrThrow(): T;

  /**
   * Get the current value or return a fallback if it is not available.
   * @param  {T} fallback A T instance.
   * @returns {T} A T instance.
   */
  getOrElse(fallback: T): T;

  /**
   * Perform some side effect on the wrapped value.
   * @param {(v: T) => void} selector Selector function.
   * @returns {Maybe<T>} A Maybe instance.
   */
  doOnNext(selector: (v: T) => void): Maybe<T>;

  /**
   * Log the wrapped value.
   * @param {(v: T) => R} [selector] Selector function.
   * @returns {Maybe<T>} A Maybe instance.
   */
  logNext<R>(selector?: (v: T) => R): Maybe<T>;

  /**
   * Log the wrapped value with some prefix.
   * @param {string} prefix A string value.
   * @param {(v: T) => R} [selector] Selector function.
   * @returns {Maybe<T>} A Maybe instance.
   */
  logNextPrefix<R>(prefix: string, selector?: (v: T) => R): Maybe<T>;
}

export abstract class Maybe<T> implements
  MaybeType<T>,
  MaybeConvertibleType<T>,
  TryConvertibleType<T>,
  FunctorType<T>,
  MonadType<T> {
  /**
   * Check if an object is convertible to a Maybe instance.
   * @param {*} object Any object.
   * @returns {object is MaybeConvertibleType<T>} A boolean value.
   */
  public static isMaybeConvertible<T>(object: any): object is MaybeConvertibleType<T> {
    return Types.isInstance<MaybeConvertibleType<T>>(object, 'asMaybe');
  }

  /**
   * Unwrap an object of ambiguous types in order to get its inner value.
   * @param {(Nullable<T> | MaybeConvertibleType<T>)} value An object of
   * ambiguous types.
   * @returns {Maybe<T>} A Maybe instance.
   */
  public static unwrap<T>(value: Nullable<T> | MaybeConvertibleType<T>): Maybe<T> {
    if (Maybe.isMaybeConvertible(value)) {
      return Maybe.some(value).flatMap(v => v);
    } else if (value !== undefined && value !== null) {
      return Maybe.some(value);
    } else {
      return Maybe.nothing();
    }
  }

  /**
   * Evaluate a function that returns a Nullable and catch errors if needed.
   * @template T Generic parameter.
   * @param {() => Nullable<T>} fn A Function instance.
   * @returns {Try<T>} A Maybe instance.
   */
  public static evaluate<T>(fn: () => Nullable<T>): Maybe<T> {
    try {
      return Maybe.unwrap(fn());
    } catch (e) {
      return Maybe.nothing();
    }
  }

  public static some<T>(value: T): Maybe<T> {
    return new Some(value);
  }

  public static nothing<T>(): Maybe<T> {
    return new Nothing();
  }

  public get value(): Indeterminate<T> {
    try {
      return this.getOrThrow();
    } catch {
      return undefined;
    }
  }

  public asMaybe(): Maybe<T> {
    return this;
  }

  public asTry(error: Nullable<Error | string> = undefined): Try<T> {
    if (this.value !== undefined && this.value !== null) {
      return Try.success(this.value);
    } else if (error !== undefined && error !== null) {
      return Try.failure(error);
    } else {
      return this.asTry(Nothing.unavailableError);
    }
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

  public getOrElse(fallback: T): T {
    try {
      return this.getOrThrow();
    } catch {
      return fallback;
    }
  }

  /**
   * Get a fallback Maybe if the current Maybe is failure.
   * @param {Return<MaybeConvertibleType<T>>} fallback A Return instance.
   * @returns {Maybe<T>} A Maybe instance.
   */
  public someOrElse(fallback: Return<MaybeConvertibleType<T>>): Maybe<T> {
    if (this.isSome()) {
      return this;
    } else {
      if (fallback instanceof Function) {
        return fallback().asMaybe();
      } else {
        return fallback.asMaybe();
      }
    }
  }

  /**
   * Catch a nothing Maybe and return a fallback value or a function producing
   * such a value.
   * @param {Return<T>} fallback A Return instance.
   * @returns {Maybe<T>} A Maybe instance.
   */
  public catchNothing(fallback: Return<T>): Maybe<T> {
    if (fallback instanceof Function) {
      return this.someOrElse(() => Maybe.evaluate(() => fallback()));
    } else {
      return this.someOrElse(() => Maybe.unwrap(fallback));
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

  public flatMap<R>(f: (value: T) => MaybeConvertibleType<R>): Maybe<R> {
    try {
      return f(this.getOrThrow()).asMaybe();
    } catch {
      return Maybe.nothing();
    }
  }

  /**
   * Cast the inner value to type R by checking a list of member properties.
   * @param {...(keyof R)[]} members Varargs of member properties to check.
   * @returns {Maybe<R>} A Maybe instance.
   */
  public castWithProperties<R>(...members: (keyof R)[]): Maybe<R> {
    return this.asTry().castWithProperties<R>(...members).asMaybe();
  }

  /**
   * Filter the inner value using some selector, and return a failure Maybe if
   * the value fails to pass the predicate.
   * @param {(v: T) => boolean} selector Selector function.
   * @returns {Maybe<T>} A Maybe instance.
   */
  public filter(selector: (v: T) => boolean): Maybe<T> {
    return this.asTry().filter(selector, Nothing.unavailableError).asMaybe();
  }

  public doOnNext(selector: (v: T) => void): Maybe<T> {
    return this.asTry().doOnNext(selector).asMaybe();
  }

  public logNext<R>(selector?: (v: T) => R): Maybe<T> {
    return this.asTry().logNext(selector).asMaybe();
  }

  public logNextPrefix<R>(prefix: string, selector?: (v: T) => R): Maybe<T> {
    return this.asTry().logNextPrefix(prefix, selector).asMaybe();
  }

  public abstract getOrThrow(): T;
}

class Some<T> extends Maybe<T> {
  private some: T;

  constructor(some: T) {
    super();
    this.some = some;
  }

  public getOrThrow(): T {
    return this.some;
  }
}

class Nothing<T> extends Maybe<T> {
  static get unavailableError(): string {
    return 'Value not available';
  }

  public getOrThrow(): T {
    throw new Error(Nothing.unavailableError);
  }
}