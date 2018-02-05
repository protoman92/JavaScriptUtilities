import { Observable } from 'rxjs';

declare module 'rxjs/Observable' {
  export interface Observable<T> {
    /**
     * Side effect: perform some action when an element is emitted.
     * @param {(element: T) => void} perform Perform function.
     * @returns {Observable<T>} An Observable instance.
     */
    doOnNext(perform: (element: T) => void): Observable<T>;

    /**
     * Side effect: perform some action when an error is emitted.
     * @param {(error: Error) => void} perform Perform function.
     * @returns {Observable<T>} An Observable instance.
     */
    doOnError(selector: (error: Error) => void): Observable<T>;

    /**
     * Side effect: perform some action when the stream completes.
     * @param  {() => void} perform Perform function.
     * @returns {Observable<T>} An Observable instance.
     */
    doOnCompleted(perform: () => void): Observable<T>;
  }
}

Observable.prototype.doOnNext = function(perform: (value: any) => void) {
  return this.do(perform);
};

Observable.prototype.doOnError = function(perform: (error: Error) => void) {
  return this.do(() => {}, perform);
};

Observable.prototype.doOnCompleted = function(perform: () => void) {
  return this.do(() => {}, () => {}, perform);
};