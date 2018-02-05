import { Observable } from 'rxjs';
import { Try } from './../functional';
import { TryResult } from './../type';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    /**
     * FlatMap to a nullable Observable and return an empty Observable if the
     * result is null.
     * @template R Generic parameter.
     * @param {(v: T) => Nullable<R>} selector Selector function.
     * @returns {Observable<R>} An Observable instance.
     */
    flatMapNonNilOrEmpty<R>(selector: (v: T) => TryResult<Observable<R>>): Observable<R>;

    /**
     * Map the inner emission to type R and return empty if the result is null.
     * @template R Generic parameter.
     * @param {(v: T) => Nullable<R>} selector Selector function.
     * @returns {Observable<R>} An Observable instance.
     */
    mapNonNilOrEmpty<R>(selector: (v: T) => TryResult<R>): Observable<R>;

    /**
     * Map the inner emission to type R and return a fallback value if the
     * result is null.
     * @template R Generic parameter.
     * @param {(v: T) => Nullable<R>} selector Selector function.
     * @param {((v: any) => R) | R} fallback Fallback selector type.
     * @returns {Observable<R>} An Observable instance.
     */
    mapNonNilOrElse<R>(selector: (v: T) => TryResult<R>, fallback: ((v: any) => R) | R): Observable<R>;
  }
}

Observable.prototype.flatMapNonNilOrEmpty =
  function<R>(selector: (v: any) => TryResult<Observable<R>>): Observable<R> {
    return this.flatMap(v => {
      let result = Try.evaluate(() => selector(v)).value;

      if (result !== undefined && result !== null) {
        return result;
      } else {
        return Observable.empty();
      }
    });
  };

Observable.prototype.mapNonNilOrEmpty =
  function<R>(selector: (v: any) => TryResult<R>): Observable<R> {
    return this.flatMapNonNilOrEmpty(v => {
      return Try.evaluate(() => selector(v)).map(v1 => Observable.of(v1));
    });
  };

Observable.prototype.mapNonNilOrElse = function<R>(
  selector: (v: any) => TryResult<R>,
  fallback: ((v: any) => R) | R,
): Observable<R> {
  return this.map(v => Try.evaluate(() => selector(v)).getOrElse(() => {
    if (fallback instanceof Function) {
      return fallback(v);
    } else {
      return fallback;
    }
  }));
};