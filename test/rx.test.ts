import { Observable } from 'rxjs';
import './../src';
import { Buildable, Builder } from './buildable.test';

const timeout = 100;

describe("Do should be implemented correctly", () => {
  it('doOnNext and doOnCompleted should be correct', (done) => {
    /// Setup
    let nextCount = 0;
    let completedCount = 0;
    let times = 1000;

    /// When
    Observable.range(0, times)
      .typeOf(Number)
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

  it('doOnError and catchJustReturn should be correct', (done) => {
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
  it('Catch just return some value should be correct', (done) => {
    /// Setup
    let message = 'Error!';
    let fallback = 1;
    let nextCount = 0;

    /// When
    try {
      Observable.error(message)
        .catchJustReturnValue(fallback)
        .cast(Number)
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

describe('Type casting should be implemented correctly', () => {
  it('cast should be correct', () => {
    /// Setup
    let buildable = new Builder().build();
    let nextCount = 0;
    let errorCount = 0;

    /// When
    try {
      Observable.of(buildable)
        .cast(Buildable)
        .doOnNext(() => nextCount += 1)
        .cast(String)
        .cast(Number)
        .cast(Builder)
        .doOnNext(fail)
        .doOnError(() => errorCount += 1)
        .doOnCompleted(fail)
        .subscribe();
    } catch (e) {
      /// Then
      expect(nextCount).toBe(1);
      expect(errorCount).toBe(1);
    }
  });

  it('typeOf should be correct', (done) => {
    /// Setup
    let buildable = new Builder().build();
    let nextCount = 0;
    let errorCount = 0;

    /// When
    Observable.of(buildable)
      .typeOf(Buildable)
      .doOnNext(() => nextCount += 1)
      .typeOf(Builder)
      .doOnNext(fail)
      .doOnError(() => errorCount += 1)
      .isEmpty()
      .doOnNext(value => expect(value).toBeTruthy())
      .doOnCompleted(() => {
        /// Then
        expect(nextCount).toBe(1);
        expect(errorCount).toBe(0);
        done();
      })
      .subscribe();
  }, timeout);
});

describe('Iterables should be implemented correctly', () => {
  it('flatMapIterable should be correct', (done) => {
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