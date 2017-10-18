"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
require("./../src");
var buildable_test_1 = require("./buildable.test");
var timeout = 100;
describe("Do should be implemented correctly", function () {
    it('doOnNext and doOnCompleted should be correct', function (done) {
        /// Setup
        var nextCount = 0;
        var completedCount = 0;
        var times = 1000;
        /// When
        rxjs_1.Observable.range(0, times)
            .typeOf(Number)
            .doOnNext(function () { return nextCount += 1; })
            .doOnCompleted(function () {
            completedCount += 1;
            /// Then
            expect(nextCount).toBe(times);
            expect(completedCount).toBe(1);
            done();
        })
            .subscribe();
    }, timeout);
    it('doOnError and catchJustReturn should be correct', function (done) {
        /// Setup
        var nextCount = 0;
        var errorCount = 0;
        var message = 'Error!';
        /// When
        try {
            rxjs_1.Observable.error(message)
                .doOnNext(function () { return nextCount += 1; })
                .doOnError(function (error) {
                errorCount += 1;
                /// Then
                expect(nextCount).toBe(0);
                expect(errorCount).toBe(1);
                expect(error.message).toBe(message);
                done();
            })
                .subscribe();
        }
        catch (e) {
            expect(e.message).toBe(message);
        }
    }, timeout);
});
describe('Catch should be implemented correctly', function () {
    it('Catch just return some value should be correct', function (done) {
        /// Setup
        var message = 'Error!';
        var fallback = 1;
        var nextCount = 0;
        /// When
        try {
            rxjs_1.Observable.error(message)
                .catchJustReturnValue(fallback)
                .cast(Number)
                .doOnNext(function (value) {
                nextCount += 1;
                /// Then
                expect(value).toBe(fallback);
            })
                .doOnCompleted(function () {
                /// Then
                expect(nextCount).toBe(1);
                done();
            })
                .subscribe();
        }
        catch (e) {
            fail(e);
        }
    }, timeout);
});
describe('Type casting should be implemented correctly', function () {
    it('cast should be correct', function () {
        /// Setup
        var buildable = new buildable_test_1.Builder().build();
        var nextCount = 0;
        var errorCount = 0;
        /// When
        try {
            rxjs_1.Observable.of(buildable)
                .cast(buildable_test_1.Buildable)
                .doOnNext(function () { return nextCount += 1; })
                .cast(String)
                .cast(Number)
                .cast(buildable_test_1.Builder)
                .doOnNext(fail)
                .doOnError(function () { return errorCount += 1; })
                .doOnCompleted(fail)
                .subscribe();
        }
        catch (e) {
            /// Then
            expect(nextCount).toBe(1);
            expect(errorCount).toBe(1);
        }
    });
    it('typeOf should be correct', function (done) {
        /// Setup
        var buildable = new buildable_test_1.Builder().build();
        var nextCount = 0;
        var errorCount = 0;
        /// When
        rxjs_1.Observable.of(buildable)
            .typeOf(buildable_test_1.Buildable)
            .doOnNext(function () { return nextCount += 1; })
            .typeOf(buildable_test_1.Builder)
            .doOnNext(fail)
            .doOnError(function () { return errorCount += 1; })
            .logNext()
            .isEmpty()
            .logNext()
            .doOnNext(function (value) { return expect(value).toBeTruthy(); })
            .doOnCompleted(function () {
            /// Then
            expect(nextCount).toBe(1);
            expect(errorCount).toBe(0);
            done();
        })
            .subscribe();
    }, timeout);
});
describe('Iterables should be implemented correctly', function () {
    it('flatMapIterable should be correct', function (done) {
        /// Setup
        var array = [1, 2, 3, 4];
        var nextCount = 0;
        /// When
        rxjs_1.Observable.of(array)
            .flatMapIterable(function (value) { return value; })
            .doOnNext(function (value) {
            nextCount += 1;
            /// Then
            expect(array).toContain(value);
        })
            .doOnCompleted(function () {
            /// Then
            expect(nextCount).toBe(array.length);
            done();
        })
            .subscribe();
    }, timeout);
});
//# sourceMappingURL=rx.test.js.map