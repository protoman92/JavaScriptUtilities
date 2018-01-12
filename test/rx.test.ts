import { Observable, Subject, Subscription } from 'rxjs';
import './../src';
import { IncompletableSubject } from './../src';

const timeout = 100;

describe("Do should be implemented correctly", () => {
  it('doOnNext and doOnCompleted should work correctly', (done) => {
    /// Setup
    let nextCount = 0;
    let completedCount = 0;
    let times = 1000;

    /// When
    Observable.range(0, times)
      .doOnNext(() => nextCount += 1)
      .doOnCompleted(() => {
        completedCount += 1;

        /// Then
        expect(nextCount).toBe(times);
        expect(completedCount).toBe(1);
        done();
      })
      .subscribe();
  }, timeout);

  it('doOnError and catchJustReturn should work correctly', (done) => {
    /// Setup
    let nextCount = 0;
    let errorCount = 0;
    let message = 'Error!';

    /// When
    try {
      Observable.error<Number>(message)
        .doOnNext(() => nextCount += 1)
        .doOnError((error: Error) => {
          errorCount += 1;

          /// Then
          expect(nextCount).toBe(0);
          expect(errorCount).toBe(1);
          expect(error.message).toBe(message);
          done();
        })
        .subscribe();
    } catch (e) {
      expect(e.message).toBe(message);
    }
  }, timeout);
});

describe('Catch should be implemented correctly', () => {
  it('Catch just return some value should work correctly', (done) => {
    /// Setup
    let message = 'Error!';
    let fallback = 1;
    let nextCount = 0;

    /// When
    try {
      Observable.error(message)
        .catchJustReturnValue(fallback)
        .doOnNext((value) => {
          nextCount += 1;

          /// Then
          expect(value).toBe(fallback);
        })
        .doOnCompleted(() => {
          /// Then
          expect(nextCount).toBe(1);
          done();
        })
        .subscribe();
    } catch (e) {
      fail(e);
    }
  }, timeout);
});

describe('Iterables should be implemented correctly', () => {
  it('flatMapIterable should work correctly', (done) => {
    /// Setup
    let array = [1, 2, 3, 4];
    let nextCount = 0;

    /// When
    Observable.of(array)
      .flatMapIterable(value => value)
      .doOnNext(value => {
        nextCount += 1;

        /// Then
        expect(array).toContain(value);
      })
      .doOnCompleted(() => {
        /// Then
        expect(nextCount).toBe(array.length);
        done();
      })
      .subscribe();
  }, timeout);
});

describe('flatMap and map non nil should be implemented correctly', () => {
  it('Map non nil or empty should be implemented correctly', done => {
    /// Setup & When & Then
    Observable.of<any>(1)
      .flatMap(v => Observable.merge(
        Observable.of(v).mapNonNilOrEmpty(v1 => (<string>v1).length),
        Observable.of(v).mapNonNilOrEmpty(() => { throw Error('Failed!'); }),
      ))
      .isEmpty()
      .doOnNext(v => expect(v).toBeTruthy())
      .doOnCompleted(() => done())
      .subscribe();
  }, timeout);

  it('Map non nil or else should be implemented correctly', done => {
    /// Setup & When & Then
    Observable.of<any>(1)
      .flatMap(v => Observable.merge(
        Observable.of(v).mapNonNilOrElse(v1 => (<string>v1).length, () => 2),
        Observable.of(v).mapNonNilOrElse(() => { throw Error('Failed!'); }, 2),
      ))
      .doOnNext(v => expect(v).toBe(2))
      .isEmpty()
      .doOnNext(v => expect(v).toBeFalsy())
      .doOnCompleted(() => done())
      .subscribe();
  });
});

describe('Subscription\'s utilities should be implemented correctly', () => {
  it('Subscription\'s disposed(by) should be implemented correctly', () => {
    /// Setup
    let disposedCount = 0;

    let obs1 = new Observable<number>(obs => {
      obs.next(1);
      obs.complete();
      return () => disposedCount += 1;
    });

    let subscription = new Subscription();

    /// When
    obs1.subscribe().toBeDisposedBy(subscription);
    subscription.unsubscribe();

    /// Then
    expect(disposedCount).toBe(1);
  });
});

describe('IncompletableSubject should be implemented correctly', () => {
  /// Setup
  let subject = new Subject<number>();
  let wrapper = new IncompletableSubject(subject);
  let events: number[] = [];
  wrapper.asObservable().doOnNext(v => events.push(v)).subscribe();

  /// When
  wrapper.next(1);
  wrapper.next(2);
  wrapper.error(new Error(''));
  wrapper.complete();
  wrapper.next(3);

  /// Then
  expect(events).toEqual([1, 2, 3]);
});