import { Observable, Observer, Subject } from 'rxjs';

/**
 * Use this subject wrapper to ignore error and completed events.
 * @implements {Observer<T>} Observer implementation.
 * @template T Generics parameter.
 */
export default class IncompletableSubject<T> implements Observer<T> {
  private readonly subject: Subject<T>;

  public constructor(subject: Subject<T>) {
    this.subject = subject;
  }

  public next = (v: T): void => {
    this.subject.next(v);
  }

  public error = (_e: Error): void => {};
  public complete = (): void => {};
  public asObservable = (): Observable<T> => this.subject;
}