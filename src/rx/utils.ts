import { Observable } from 'rxjs';
import { Try } from './../functional/Try';

/**
 * Ensure the order of emission according to some order selector by skipping
 * some elements if they are out of order.
 * @template T Generic parameter.
 * @param {Observable<T>} stream An Observable instance.
 * @param {(current: T, previous: T) => boolean} fn Order selector function.
 * If this function returns true, emit current, otherwise skip it.
 * @returns {Observable<T>} An Observable instance.
 */
export function ensureOrder<T>(
  stream: Observable<T>,
  fn: (current: T, previous: T) => boolean,
): Observable<T> {
  interface ScannedValue {
    larger: boolean;
    value: Try<T>;
  }

  return stream
    .scan((acc: ScannedValue, v: T): ScannedValue => ({
      larger: acc.value.map(v1 => fn(v, v1)).getOrElse(true),
      value: Try.success(v),
    }), { larger: true, value: Try.failure<T>('') })
    .filter(v => v.larger)
    .mapNonNilOrEmpty(v => v.value);
}