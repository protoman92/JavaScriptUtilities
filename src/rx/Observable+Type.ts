import { Observable } from 'rxjs';
import { Types } from './../type';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    
    /**
     * Attemp to cast the emitted elements, failure of which will throw an
     * Error.
     * @param  {new(} typeFn Type constructor from which to get type name.
     * @returns Observable An Observable instance.
     */
    cast<R extends T>(typeFn: new () => R): Observable<R>;

    /**
     * Attempt to cast the emitted elements, failure of which will empty the
     * sequence.
     * @param  {new(} typeFn Type constructor from which to get type name.
     * @returns Observable An Observable instance.
     */
    typeOf<R extends T>(typeFn: new () => R): Observable<R>;
  }
}

Observable.prototype.cast = function<R>(typeFn: new () => R) {
  return this.map(value => Types.cast(value, typeFn));
};

Observable.prototype.typeOf = function<R>(typeFn: new () => R) {
  return this.flatMap(value => {
    try {
      return Observable.of(Types.cast(value, typeFn));
    } catch {
      return Observable.empty();
    }
  });
};