import { Observable } from 'rxjs';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    /**
     * Flatten an emission by converting it to an Array of some type.
     * @param  {(value:T)=>R[]} transform Transform function.
     * @returns Observable An Observable instance.
     */
    flatMapIterable<R>(transform: (value: T) => R[]): Observable<R>;
  }
}

Observable.prototype.flatMapIterable = function(transform: (value: any) => any[]) {
  return this.flatMap(value => Observable.from(transform(value)));
};