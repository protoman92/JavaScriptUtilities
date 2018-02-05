import { Observable } from 'rxjs';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    /**
     * Catch the emitted Error and transform it to some other value, then emit
     * that value.
     * @param {(error: Error) => R} transform Transform function.
     * @returns {Observable<R>} An Observable instance.
     */
    catchJustReturn<R>(transform: (error: Error) => R): Observable<R>;

    /**
     * Catch the emitted Error and simply emit some other value.
     * @param {R} value A R instance.
     * @returns {Observable<R>} An Observable instance.
     */
    catchJustReturnValue<R>(value: R): Observable<R>;
  }

  namespace Observable {
    /**
     * Emit an error with some message.
     * @param {string} message A string value.
     * @returns {Observable<T>} An Observable instance.
     */
    export function error<T>(message: string): Observable<T>;
  }
}

Observable.error = function<T>(message: string): Observable<T> {
  return Observable.throw(new Error(message));
};

Observable.prototype.catchJustReturn = function(transform: (error: Error) => any) {
  return this.catch((err: Error) => {
    return Observable.of(transform(err));
  });
};

Observable.prototype.catchJustReturnValue = function(value: any) {
  return this.catchJustReturn(() => value);
};