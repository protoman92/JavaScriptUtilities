import { Observer, Subject } from 'rxjs';
import * as MappableObserver from './MappableObserver';

/**
 * Convenience method to map an Observer.
 * @template T Generic parameter.
 * @template R Generic parameter.
 * @param {Observer<R>} observer An Observer instance.
 * @param {(v: T) => R} selector Selector function.
 * @returns {MappableObserver.Type<T>} A MappableObserver instance.
 */
function mapObserver<T, R>(observer: Observer<R>, selector: (v: T) => R): MappableObserver.Type<T> {
  return new MappableObserver.Self(observer, selector);
}

declare module 'rxjs/Subject' {
  interface Subject<T> {
    mapObserver<T0>(selector: (v: T0) => T): MappableObserver.Type<T0>;
  }
}

Subject.prototype.mapObserver = function<T0>(selector: (v: T0) => any) {
  return mapObserver(this, selector);
};