import { Observable } from 'rxjs';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    
    /**
     * Log the next emission.
     * @param  {(value:T)=>R} transform? Optional transform function to convert
     * the emission to another type. If this is omitted, simply log the emission.
     * @returns Observable An Observable instance.
     */
    logNext<R>(transform?: (value: T) => R): Observable<T>;

    /**
     * Log the emitted Error.
     * @param  {(error:Error)=>R} transform? Optional transform function to
     * convert the error to another type. If this is omitted, simply log the
     * error.
     * @returns Observable An Observable instance.
     */
    logError<R>(transform?: (error: Error) => R): Observable<T>;
  }
}

Observable.prototype.logNext = function(transform: (value: any) => any) {
  return this.doOnNext((value) => {
    if (transform != undefined) {
      console.log(transform(value));
    } else {
      console.log(value);
    }
  });
};

Observable.prototype.logError = function(transform: (error: Error) => any) {
  return this.doOnError((error) => {
    if (transform != undefined) {
      console.log(transform(error));
    } else {
      console.log(error);
    }
  });
};