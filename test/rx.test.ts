import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';

import './../src';

import {
  Collections,
  IncompletableSubject,
  Nullable,
  Numbers,
  Reactives,
} from './../src';

const timeout = 10000;

describe('Do should be implemented correctly', () => {
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
  let mappableWrapper = wrapper.mapObserver<number>(v => v * 2);
  let events: number[] = [];
  wrapper.asObservable().doOnNext(v => events.push(v)).subscribe();

  /// When
  mappableWrapper.next(1);
  mappableWrapper.next(2);
  mappableWrapper.error(new Error(''));
  mappableWrapper.complete();
  mappableWrapper.next(3);

  /// Then
  expect(events).toEqual([2, 4, 6]);
});

describe('MappableObserver should be implemented correctly', () => {
  let testObserver = (subject: Subject<Nullable<number>>): void => {
    /// Setup
    let times = 10;
    let range = Numbers.range(0, times);
    let elements: number[] = [];

    let observer = subject
      .mapObserver<string>(v => Number.parseInt(v))
      .mapObserver<number>(v => '' + v)
      .mapObserver<number>(v => v * 2);

    subject
      .mapNonNilOrEmpty(v => v)
      .doOnNext(v => elements.push(v))
      .subscribe();

    /// When
    for (let i of range) {
      observer.next(i);
    }

    /// Then
    expect(elements).toEqual(range.map(v => v * 2));
  };

  it('Mappable observer wrapper - should work correctly', () => {
    testObserver(new BehaviorSubject<Nullable<number>>(undefined));
    testObserver(new ReplaySubject<Nullable<number>>());
    testObserver(new Subject<Nullable<number>>());
  });
});

describe('ensureOrder should be implemented correctly', () => {
  it('ensureOrder should be implemented correctly', done => {
    /// Setup
    let times = 10;
    let valueTrigger = new Subject<number>();
    let subscription = new Subscription();
    let values: number[] = [];
    let sortFn: (a: number, b: number) => boolean = (a, b) => (a - b) > 0;

    Reactives.ensureOrder(valueTrigger, sortFn)
      .doOnNext(v => values.push(v))
      .subscribe()
      .toBeDisposedBy(subscription);

    /// When
    Numbers.range(0, times).forEach(() => {
      let randomValue = Numbers.randomBetween(0, 100000);
      valueTrigger.next(randomValue);
    });

    /// Then
    let sortedValues = values.sort((a, b) => sortFn(a, b) ? 1 : -1);
    let equals = Collections.zip(values, sortedValues, (a, b) => a === b);
    expect(values.length).toBeGreaterThan(0);
    expect(values).toEqual(sortedValues);
    expect(equals.getOrThrow().every(v => v)).toBeTruthy();
    done();
  }, timeout);
});