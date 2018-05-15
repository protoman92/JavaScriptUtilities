import FunctorType from './FunctorType';
import MonadType from './MonadType';
import { MaybeConvertibleType, Maybe } from './Maybe';
import { Indeterminate, Nullable, Return, Throwable, TryResult, Types } from './../type';

export type TryMap<T, R> = (value: T) => R;
export type TryFlatMap<T, R> = (value: T) => TryConvertibleType<R>;

export interface TryConvertibleType<T> extends MaybeConvertibleType<T> {

  /**
   * Convert the current object into a Try.
   * @returns Try A Try instance.
   */
  asTry(): Try<T>;
}

export interface TryType<T> {
  /**
   * Perform some side effect on the wrapped value.
   * @param {(v: T) => void} selector Selector function.
   * @returns {Try<T>} A Try instance.
   */
  doOnNext(selector: (v: T) => void): Try<T>;

  /**
   * Log the wrapped value.
   * @param {(v: T) => R} [selector] Selector function.
   * @returns {Try<T>} A Maybe instance.
   */
  logNext<R>(selector?: (v: T) => R): Try<T>;

  /**
   * Log the wrapped value with some prefix.
   * @param {string} prefix A string value.
   * @param {(v: T) => R} [selector] Selector function.
   * @returns {Try<T>} A Try instance.
   */
  logNextPrefix<R>(prefix: string, selector?: (v: T) => R): Try<T>;

  /**
   * Perform some side effects on the wrapped error.
   * @param {(e: Error) => void} selector Selector function.
   * @returns {Try<T>} A Try instance.
   */
  doOnError(selector: (e: Error) => void): Try<T>;

  /**
   * Log the wrapped error.
   * @param {(e: Error) => R} [selector] Selector function.
   * @returns {Try<T>} A Try instance.
   */
  logError<R>(selector?: (e: Error) => R): Try<T>;

  /**
   * Log the wrapped error with some prefix.
   * @param {string} prefix A string value.
   * @param {(e: Error) => R} [selector] Selector function.
   * @returns {Try<T>} A Try instance.
   */
  logErrorPrefix<R>(prefix: string, selector?: (e: Error) => R): Try<T>;
}

export abstract class Try<T> implements
  MaybeConvertibleType<T>,
  TryConvertibleType<T>,
  TryType<T>,
  FunctorType<T>,
  MonadType<T> {
  /**
   * Check if an object is convertible to a Try instance.
   * @param {*} object Any object.
   * @returns {object is TryConvertibleType<T>} A boolean value.
   */
  public static isTryConvertible<T>(object: any): object is TryConvertibleType<T> {
    return Types.isInstance<TryConvertibleType<T>>(object, 'asTry');
  }

  /**
   * Evaluate a function that returns a TryResult and catch errors if needed.
   * @template T Generic parameter.
   * @param {() => TryResult<T>} fn A Function instance.
   * @returns {Try<T>} A Try instance.
   */
  public static evaluate<T>(fn: () => TryResult<T>): Try<T> {
    try {
      return Try.unwrap(fn());
    } catch (e) {
      return Try.failure(e);
    }
  }

  /**
   * Unwrap an object of ambiguous types in order to get its inner value.
   * @param {TryResult<T>} value A TryResult instance.
   * @param {Throwable} error A Throwable instance.
   * @returns {Try<T>} A Try instance.
   */
  public static unwrap<T>(value: TryResult<T>, error: Nullable<Throwable> = undefined): Try<T> {
    if (Try.isTryConvertible(value)) {
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

  public static failure<T>(error: Throwable): Try<T> {
    if (error instanceof Error) {
      return new Failure(error);
    } else {
      return new Failure(new Error(error));
    }
  }

  /**
   * Zip two TryConvertibleType with a selector function.
   * @template T Generics parameter.
   * @template R Generics parameter.
   * @template U Generics parameter.
   * @param {TryConvertibleType<T>} try1 A TryConvertibleType instance.
   * @param {TryConvertibleType<R>} try2 A TryConvertibleType instance.
   * @param {(v1: T, v2: R) => U} selector A selector function.
   * @returns {Try<U>} A TryConvertibleType instance.
   */
  public static zip<T, R, U>(
    try1: TryConvertibleType<T>,
    try2: TryConvertibleType<R>,
    selector: (v1: T, v2: R) => U,
  ): Try<U> {
    return try1.asTry().zipWith(try2, selector);
  }

  /**
   * Zip two TryConvertibleType with a default selector function.
   * @template T Generics parameter.
   * @template R Generics parameter.
   * @param {TryConvertibleType<T>} try1 A TryConvertibleType instance.
   * @param {TryConvertibleType<R>} try2 A TryConvertibleType instance.
   * @returns {Try<[T, R]>} A Try instance.
   */
  public static zipDefault<T, R>(try1: TryConvertibleType<T>, try2: TryConvertibleType<R>): Try<[T, R]> {
    return this.zip(try1, try2, (v1, v2): [T, R] => [v1, v2]);
  }

  protected constructor() { }

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

  public asMaybe(): Maybe<T> {
    try {
      let value = this.getOrThrow();
      return Maybe.some(value);
    } catch {
      return Maybe.nothing<T>();
    }
  }

  public asTry(): Try<T> {
    return this;
  }

  public isSome(): boolean {
    return this.isSuccess();
  }

  public isNothing(): boolean {
    return !this.isSome();
  }

  public isSuccess(): boolean {
    try {
      this.getOrThrow();
      return true;
    } catch {
      return false;
    }
  }

  public isFailure(): boolean {
    return !this.isSuccess();
  }

  public getOrElse(fallback: Return<T>): T {
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
  public successOrElse(fallback: Return<TryConvertibleType<T>>): Try<T> {
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

  /**
   * Catch a failure Try and return a fallback value or a function producing
   * such a value.
   * @param {Return<T>} fallback A Return instance.
   * @returns {Maybe<T>} A Try instance.
   */
  public catchError(fallback: Return<T>): Try<T> {
    if (fallback instanceof Function) {
      return this.successOrElse(() => Try.evaluate(() => fallback()));
    } else {
      return this.successOrElse(() => Try.unwrap(fallback));
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
   * @param {((e: Error) => Throwable)} f Transform function.
   * @returns {Try<T>} A Try instance.
   */
  public mapError(f: (e: Error) => Throwable): Try<T> {
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
   * Cast the inner value to type R by checking a list of member properties.
   * @param {...(keyof R)[]} members Varargs of member properties to check.
   * @returns {Try<R>} A Try instance.
   */
  public castWithProperties<R>(...members: (keyof R)[]): Try<R> {
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
   * @param {(v: T) => boolean} selector Selector function.
   * @param {(Throwable | ((v: T) => Throwable))} error Error (selector).
   * @returns {Try<T>} A Try instance.
   */
  public filter(selector: (v: T) => boolean, error: Throwable | ((v: T) => Throwable)): Try<T> {
    return this.flatMap(v => {
      if (selector(v)) {
        return Try.success(v);
      } else {
        if (error instanceof Function) {
          return Try.failure(error(v));
        } else {
          return Try.failure(error);
        }
      }
    });
  }

  public doOnNext(selector: (v: T) => void): Try<T> {
    try {
      selector(this.getOrThrow());
    } catch (e) { }

    return this.map(v => v);
  }

  public logNext<R>(selector?: (v: T) => R): Try<T> {
    return this.doOnNext(v => console.log(selector !== undefined ? selector(v) : v));
  }

  public logNextPrefix<R>(prefix: string, selector?: (v: T) => R): Try<T> {
    return this.logNext(v => `${prefix}${selector !== undefined ? selector(v) : v}`);
  }

  public doOnError(selector: (e: Error) => void): Try<T> {
    try {
      this.getOrThrow();
    } catch (e) {
      try {
        selector(e);
      } catch (e) { }
    }

    return this.map(v => v);
  }

  public logError<R>(selector?: (e: Error) => R): Try<T> {
    return this.doOnError(e => console.log(selector !== undefined ? selector(e) : e));
  }

  public logErrorPrefix<R>(prefix: string, selector?: (e: Error) => R): Try<T> {
    return this.logError(e => `${prefix}${selector !== undefined ? selector(e) : e}`);
  }

  /**
   * Zip with another TryConvertibleType using a selector function.
   * @template R Generics parameter.
   * @template U Generics paremeter.
   * @param {TryConvertibleType<R>} try2 A TryConvertibleType instance.
   * @param {(v1: T, v2: R) => U} selector A selector function.
   * @returns {Try<U>} A Try instance.
   */
  public zipWith<R, U>(try2: TryConvertibleType<R>, selector: (v1: T, v2: R) => U): Try<U> {
    return this.flatMap(v1 => try2.asTry().map(v2 => selector(v1, v2)));
  }

  /**
   * Zip with another TryConvertibleType using a default selector function.
   * @template R Generics parameter.
   * @param {TryConvertibleType<R>} try2 A TryConvertibleType instance.
   * @returns {Try<[T, R]>} A Try instance.
   */
  public zipWithDefault<R>(try2: TryConvertibleType<R>): Try<[T, R]> {
    return this.zipWith(try2, (v1, v2): [T, R] => [v1, v2]);
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