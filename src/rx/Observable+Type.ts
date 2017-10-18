import { Observable } from 'rxjs';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    
    /**
     * Attemp to cast the emitted elements, failure of which will throw an
     * Error.
     * @param  {new(} typeFn Type constructor from which to get type name.
     * @returns Observable An Observable instance.
     */
    cast<R>(typeFn: new () => R): Observable<R>;

    /**
     * Attempt to cast the emitted elements, failure of which will empty the
     * sequence.
     * @param  {new(} typeFn Type constructor from which to get type name.
     * @returns Observable An Observable instance.
     */
    typeOf<R>(typeFn: new () => R): Observable<R>;
  }
}

Observable.prototype.cast = function<R>(typeFn: new () => R) {
  return this.map(value => {
    if ((typeof value).toLowerCase() === typeFn.name.toLowerCase()) {
      return <R>value;
    } else if (value instanceof typeFn) {
      return <R>value;
    } else {
      throw new Error(`Failed to cast to ${typeFn.name}. Actual: ${typeof value}`);
    }
  });
};

Observable.prototype.typeOf = function<R>(typeFn: new () => R) {
  return this.flatMap(value => {
    if ((typeof value).toLowerCase() === typeFn.name.toLowerCase()) {
      return Observable.of(value);
    } else if (value instanceof typeFn) {
      return Observable.of(value);
    } else {
      return Observable.empty<R>();
    }
  });
};