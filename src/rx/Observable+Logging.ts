import { Observable } from 'rxjs';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    
    /**
     * Log the next emission.
     * @param {(value: T) => R} [transform] Optional transform function to 
     * convert the emission to another type. If this is omitted, simply log the 
     * emission.
     * @returns {Observable<T>} An Observable instance.
     */
    logNext<R>(transform?: (value: T) => R): Observable<T>;

    /**
     * Log the emitted Error.
     * @param {(error: Error) => R} [transform] Optional transform function to
     * convert the error to another type. If this is omitted, simply log the
     * error.
     * @returns {Observable<T>} An Observable instance.
     */
    logError<R>(transform?: (error: Error) => R): Observable<T>;

    /**
     * Log the next emission with a specified prefix.
     * @param {string} prefix A string value.
     * @param {(value: T) => R} [transform] Optional transform function to 
     * convert the emission to another type. If this is omitted, simply log the 
     * emission.
     * @returns {Observable<T>} An Observable instance.
     */
    logNextPrefix<R>(prefix: string, transform?: (value: T) => R): Observable<T>;

    /** 
     * Log the emitted Error with a specified prefix.
     * @param {string} prefix A string value.
     * @param {(error: Error) => R} [transform] Optional transform function to
     * convert the error to another type. If this is omitted, simply log the
     * error.
     * @returns {Observable<T>} An Observable instance.
     */
    logErrorPrefix<R>(prefix: string, transform?: (error: Error) => R): Observable<T>;
  }
}

Observable.prototype.logNext = function(transform: (value: any) => any) {
  return this.doOnNext((value) => {
    if (transform !== undefined && transform !== null) {
      console.log(transform(value));
    } else {
      console.log(value);
    }
  });
};

Observable.prototype.logNextPrefix = function(
  prefix: string, 
  transform: (v: any) => any
) {
  return this.doOnNext(v => {
    if (transform !== undefined && transform !== null) {
      console.log(`${prefix}${transform(v)}`);
    } else {
      console.log(`${prefix}${v}`);
    }
  });
};

Observable.prototype.logError = function(transform: (error: Error) => any) {
  return this.doOnError((error) => {
    if (transform !== undefined && transform !== null) {
      console.log(transform(error));
    } else {
      console.log(error);
    }
  });
};

Observable.prototype.logErrorPrefix = function(
  prefix: string, 
  transform: (error: Error) => any
) {
  return this.doOnError(e => {
    if (transform !== undefined && transform !== null) {
      console.log(`${prefix}${transform(e)}`);
    } else {
      console.log(`${prefix}${e}`);
    }
  });
};