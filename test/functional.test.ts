import {
  Maybe,
  MaybeFlatMap,
  MaybeMap,
  Never,
  Try,
  TryFlatMap,
  TryMap,
} from './../src';

describe('Maybe should be implemented correctly', () => {
  it('Maybe getOrThrow and getOrElse should work correctly', () => {
    /// Setup
    let mb1 = Maybe.nothing<number>();
    let mb2 = Maybe.some<number>(1);

    /// When & Then
    try {
      mb1.getOrThrow();
      fail();
    } catch (e) {}

    expect(mb1.getOrElse(2)).toBe(2);
    expect(mb2.getOrThrow()).toBe(1);
    expect(mb2.getOrElse(2)).toBe(1);
  });

  it('Maybe map should work correctly', () => {
    /// Setup
    let mb1 = Maybe.nothing<number>();
    let mb2 = Maybe.some<number>(1);

    let f1: MaybeMap<number, number> = (value: number) => value * 2;
    let f2: MaybeMap<number, number> = (value: number) => value * 3;

    /// When
    let mappedMB1 = mb1.map(f1).map(f2);
    let mappedMB2 = mb2.map(f1).map(f2);

    /// Then
    expect(mappedMB1.isSome()).toBeFalsy();
    expect(mappedMB1.isNothing()).toBeTruthy();
    expect(mappedMB2.value).toBe(1 * 2 * 3);
  });

  it('Maybe flatMap should work correctly', () => {
    /// Setup
    let mb1 = Maybe.nothing<number>();
    let mb2 = Maybe.some<number>(1);
    let f1: MaybeFlatMap<number, string> = value => Try.success('' + value);
    let f2: MaybeFlatMap<string, number> = value =>
      Try.success(Number.parseInt(value));

    /// When
    let fMappedMB1 = mb1.flatMap(f1).flatMap(f2);
    let fMappedMB2 = mb2.flatMap(f1).flatMap(f2);

    /// Then
    expect(fMappedMB1.isNothing()).toBeTruthy();
    expect(fMappedMB2.value).toBe(1);
  });

  it('Maybe flatMap nullable should work correctly', () => {
    /// Setup
    let mockObject = class {
      id?: string;
    };

    let mockObject1 = new mockObject();
    mockObject1.id = undefined;

    let mockObject2 = new mockObject();
    mockObject2.id = '123';

    /// When
    let mb1 = Maybe.unwrap(mockObject1).flatMap(value =>
      Maybe.unwrap(value.id)
    );
    let mb2 = Maybe.unwrap(mockObject2).flatMap(value =>
      Maybe.unwrap(value.id)
    );

    /// Then
    expect(mb1.isNothing()).toBeTruthy();
    expect(mb2.value).toBe('123');
  });

  it('Maybe unwrap with Maybe instance should work correctly', () => {
    /// Setup & When & Then
    console.log(Maybe.unwrap(Try.failure('Error1')));
    expect(Maybe.unwrap(Try.failure('Error1')).isNothing()).toBeTruthy();
    expect(Maybe.unwrap(Maybe.some(1)).value).toBe(1);
  });

  it("Maybe's asTry should work correctly", () => {
    /// Setup
    let mb1 = Maybe.nothing<number>();
    let mb2 = Maybe.some(1);

    /// When
    let t1 = mb1.asTry('Error 1');
    let t2 = mb2.asTry('Error 2');

    /// Then
    expect(Maybe.unwrap(t1.error).map(v => v.message).value).toBe('Error 1');
    expect(t2.value).toBe(1);
  });

  it('Maybe someOrElse and catchNothing should work correctly', () => {
    /// Setup
    let m1 = Maybe.some(1);
    let m2 = Maybe.nothing();

    /// When
    let m1s = m1.someOrElse(Try.success(2));
    let m2s = m2.someOrElse(() => Try.success(2));
    let m3c = m1.catchNothing(() => 2);
    let m4c = m2.catchNothing(2);
    let m5c = m2.catchNothing(() => 2);
    let m6c = m2.catchNothing(() => {
      throw Error('');
    });

    /// Then
    expect(m1s.value).toBe(1);
    expect(m2s.value).toBe(2);
    expect(m3c.value).toBe(1);
    expect(m4c.value).toBe(2);
    expect(m5c.value).toBe(2);
    expect(m6c.isNothing()).toBeTruthy();
  });
});

describe('Try should be implemented correctly', () => {
  it('Try getOrThrow should work correctly', () => {
    /// Setup
    let t1 = Try.failure<number>('Error 1');
    let t2 = Try.success<number>(1);

    /// When & Then
    try {
      t1.getOrThrow();
      fail();
    } catch (e) {
      expect(e.message).toBe('Error 1');
    }

    expect(t1.getOrElse(2)).toBe(2);
    expect(t2.getOrThrow()).toBe(1);
    expect(t2.getOrElse(2)).toBe(1);
  });

  it('Try map should work correctly', () => {
    /// Setup
    let t1 = Try.failure<number>('Error 1');
    let t2 = Try.success<number>(1);

    let f1: TryMap<number, number> = value => value * 2;
    let f2: TryMap<number, number> = value => value * 3;

    /// When
    let mappedT1 = t1.map(f1).map(f2);
    let mappedT2 = t2.map(f1).map(f2);

    /// Then
    try {
      mappedT1.getOrThrow();
      fail();
    } catch (e) {
      expect(e.message).toBe('Error 1');
    }

    expect(mappedT2.value).toBe(6);
  });

  it('Try flatMap should work correctly', () => {
    /// Setup
    let t1 = Try.failure<number>('Error 1');
    let t2 = Try.success<number>(1);
    let f1: TryFlatMap<number, string> = value => Maybe.some('' + value);
    let f2: TryFlatMap<string, number> = value =>
      Maybe.some(Number.parseInt(value));

    /// When
    t1.flatMap(f1).flatMap(f2);
    t2.flatMap(f1).flatMap(f2);

    /// Then
    expect(t1.isFailure()).toBeTruthy();
    expect(t2.value).toBe(1);
  });

  it('Try flatMap with nullable should work correctly', () => {
    /// Setup
    let t1 = Try.success<number>(1);

    let f: (value: number) => Never<number> = value => {
      if (value % 2 === 0) {
        return value;
      } else {
        return undefined;
      }
    };

    /// When
    let flatMappedT1 = t1.flatMap(v => Maybe.some(f(v)));

    /// Then
    expect(flatMappedT1.isFailure()).toBeTruthy();
  });

  it('Try unwrap with Try instance should work correctly', () => {
    /// Setup & When & Then
    expect(Try.unwrap(Try.failure('Error1')).isFailure()).toBeTruthy();
    expect(Try.unwrap(Maybe.nothing()).isFailure()).toBeTruthy();
    expect(Try.unwrap(Try.success(1)).value).toBe(1);
    expect(Try.unwrap(Maybe.some(1)).value).toBe(1);
    expect(Try.unwrap(Try.success(2)).isSuccess()).toBeTruthy();
  });

  it('Try zip and zipWith should work correctly', () => {
    /// Setup
    let t1 = Try.success(1);
    let t2 = Try.failure<number>('');

    /// When
    let t1z = t1.zipWith(t2, (v1, v2) => v1 + v2);
    let t2z = t2.zipWithDefault(t2);
    let t3z = Try.zip(t1, t2, (v1, v2) => v1 + v2);
    let t4z = Try.zipDefault(t1, t2);

    /// Then
    expect(t1z.isFailure()).toBeTruthy();
    expect(t2z.isFailure()).toBeTruthy();
    expect(t3z.isFailure()).toBeTruthy();
    expect(t4z.isFailure()).toBeTruthy();
  });

  it('Try zipAll with error should work correctly', () => {
    /// Setup
    let tries1 = [
      Try.success(1),
      Try.failure('Error 1'),
      Try.failure('Error 2'),
    ];

    let tries2: Try<number>[] = [
      Try.success<number>(1),
      Try.success<number>(2),
      Try.success<number>(3),
    ];

    /// When
    let zippedTries1 = Try.zipAll(tries1, () => undefined);

    let zippedTries2 = Try.zipAll(tries2, values =>
      values.reduce((v1: number, v2: number) => v1 + v2, 0)
    );

    /// Then
    try {
      zippedTries1.getOrThrow();
      fail();
    } catch (e) {
      expect(e.message).toBe('Error 1');
    }

    expect(zippedTries2.value).toBe(6);
  });

  it('Try successOrElse and catchError should work correctly', () => {
    /// Setup
    let t1 = Try.success(1);
    let t2 = Try.failure('Error!');

    /// When
    let t1s = t1.successOrElse(Try.success(2));
    let t2s = t2.successOrElse(() => Try.success(2));
    let t3c = t1.catchError(2);
    let t4c = t2.catchError(() => 2);
    let t5c = t2.catchError(2);
    let t6c = t2.catchError(() => {
      throw Error('Error!');
    });

    /// Then
    expect(t1s.value).toBe(1);
    expect(t2s.value).toBe(2);
    expect(t3c.value).toBe(1);
    expect(t4c.value).toBe(2);
    expect(t5c.value).toBe(2);
    expect(t6c.error!.message).toBe('Error!');
  });

  it('Try mapError should work correctly', () => {
    /// Setup
    let t1 = Try.success(1);
    let t2 = Try.failure('Error 1');

    /// When
    let t1f = t1.mapError(() => 'Error 2');
    let t2f = t2.mapError(() => 'Error 2');

    /// Then
    expect(t1f.value).toBe(1);
    expect(t2f.isFailure()).toBeTruthy();
    expect(Try.unwrap(t2f.error).getOrThrow().message).toBe('Error 2');
  });

  it('Try unwrap with function should work correctly', () => {
    /// Setup
    let fn: () => number = () => 123;

    /// When
    let tryFn = Try.unwrap(fn).getOrThrow();

    /// Then
    expect(tryFn()).toBe(123);
  });
});

describe('Common functionalities', () => {
  it('Maybe/Try filter should work correctly', () => {
    /// Setup
    let t1 = Try.success(1);
    let t2 = Try.success(2);
    let m1 = Maybe.some(3);
    let m2 = Maybe.nothing();
    let isEven = (v: number) => v % 2 === 0;
    let isOdd = (v: number) => v % 2 !== 0;

    /// When
    let t1f = t1.filter(isEven, 'Error!');
    let t2f = t2.filter(isOdd, () => 'Error!');
    let m1f = m1.filter(isOdd);
    let m2f = m2.filter(isEven);

    /// Then
    expect(t1f.isFailure()).toBeTruthy();
    expect(t2f.isFailure()).toBeTruthy();
    expect(m1f.value).toBe(3);
    expect(m2f.isNothing()).toBeTruthy();
  });

  it('Maybe/Try doOnNext/logNext/logError should work correctly', () => {
    /// Setup
    let sideEffects: any[] = [];

    let doOnNext = (v: any): void => {
      sideEffects.push(v);
    };

    let t1 = Try.success(1);
    let t2 = Try.failure<string>('Failure!');
    let m1 = Maybe.some(3);
    let m2 = Maybe.nothing();

    /// When
    let t1sf = t1
      .doOnNext(doOnNext)
      .logNext()
      .logError();
    let t2sf = t2
      .doOnNext(doOnNext)
      .logNext()
      .logError();
    let m1sf = m1.doOnNext(doOnNext).logNext();
    let m2sf = m2.doOnNext(doOnNext).logNext();

    /// Then
    expect(sideEffects).toEqual([1, 3]);

    [[t1, t1sf], [t2, t2sf], [m1, m1sf], [m2, m2sf]].forEach(v => {
      expect(JSON.stringify(v[0])).toEqual(JSON.stringify(v[1]));
    });
  });

  it('Convenience access methods should work correctly', () => {
    /// Setup
    let t1 = Try.success(1);
    let t2 = Try.success(true);
    let t3 = Try.success('');
    let t4 = Try.success({a: 1});
    let unsupported = Try.success<any>(undefined);

    /// When && Then
    expect(t1.numberOrFail().value).toEqual(1);
    expect(t2.booleanOrFail().value).toEqual(true);
    expect(t3.stringOrFail().value).toEqual('');
    expect(t4.objectOrFail().value).toEqual({a: 1});
    expect(unsupported.booleanOrFail('Error').error!.message).toEqual('Error');
    expect(unsupported.numberOrFail('Error').error!.message).toEqual('Error');
    expect(unsupported.objectOrFail('Error').error!.message).toEqual('Error');
    expect(unsupported.stringOrFail('Error').error!.message).toEqual('Error');
  });
});
