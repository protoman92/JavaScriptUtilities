import {
  Maybe,
  MaybeMap,
  MaybeFlatMap,
  Numbers,
  Try,
  TryMap,
  TryFlatMap,
  Nullable
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

    let f1: MaybeMap<number,number> = (value: number) => value * 2;
    let f2: MaybeMap<number,number> = (value: number) => value * 3;

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

    let f1: MaybeFlatMap<number,string> = value => Try.success('' + value);
    let f2: MaybeFlatMap<string,number> = value => Try.success(parseInt(value));

    /// When
    let fMappedMB1 = mb1.flatMap(f1).flatMap(f2);
    let fMappedMB2 = mb2.flatMap(f1).flatMap(f2);

    /// Then
    expect(fMappedMB1.isNothing()).toBeTruthy();
    expect(fMappedMB2.value).toBe(1);
  });

  it('Maybe flatMap nullable should work correctly', () => {
    /// Setup
    let MockObject = class { id?: string; };

    let mockObject1 = new MockObject();
    mockObject1.id = undefined;

    let mockObject2 = new MockObject();
    mockObject2.id = '123';

    /// When
    let mb1 = Maybe.unwrap(mockObject1).flatMap(value => Maybe.unwrap(value.id));
    let mb2 = Maybe.unwrap(mockObject2).flatMap(value => Maybe.unwrap(value.id));

    /// Then
    expect(mb1.isNothing()).toBeTruthy();
    expect(mb2.value).toBe('123');
  });

  it('Maybe unwrap with Maybe instance should work correctly', () => {
    /// Setup & When & Then
    expect(Maybe.unwrap(Try.failure('Error1')).isNothing()).toBeTruthy();
    expect(Maybe.unwrap(Maybe.some(1)).value).toBe(1);
  });

  it('Maybe\'s asTryWithError should work correctly', () => {
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

  it('Maybe someOrElse should work correctly', () => {
    /// Setup
    let m1 = Maybe.some(1);
    let m2 = Maybe.nothing();

    /// When
    let m1s = m1.someOrElse(Try.success(2));
    let m2s = m2.someOrElse(() => Try.success(2));

    /// Then
    expect(m1s.value).toBe(1);
    expect(m2s.value).toBe(2);
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

    let f1: TryMap<number,number> = value => value * 2;
    let f2: TryMap<number,number> = value => value * 3;

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

    let f1: TryFlatMap<number,string> = (value) => Maybe.some('' + value);
    let f2: TryFlatMap<string,number> = (value) => Maybe.some(parseInt(value));

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

    let f: (value: number) => Nullable<number> = value => {
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

  it('Try zipAll with error should work correctly', () => {
    /// Setup
    let tries1 = [
      Try.success(1), 
      Try.failure('Error 1'), 
      Try.failure('Error 2')
    ];

    let tries2: [Try<number>] = [
      Try.success<number>(1), 
      Try.success<number>(2), 
      Try.success<number>(3)
    ];

    /// When
    let zippedTries1 = Try.zipAll(tries1, () => undefined);

    let zippedTries2 = Try.zipAll(tries2, values => 
      values.reduce((v1: number, v2: number) => v1 + v2, 0));

    /// Then
    try {
      zippedTries1.getOrThrow();
      fail();
    } catch (e) {
      expect(e.message).toBe('Error 1');
    }

    expect(zippedTries2.value).toBe(6);
  });

  it('Try successOrElse should work correctly', () => {
    /// Setup
    let t1 = Try.success(1);
    let t2 = Try.failure('Error!');

    /// When
    let t1s = t1.successOrElse(Try.success(2));
    let t2s = t2.successOrElse(() => Try.success(2));

    /// Then
    expect(t1s.value).toBe(1);
    expect(t2s.value).toBe(2);
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
});

describe('Common functionalities', () => {
  it('Maybe/Try cast should work correctly', () => {
    /// Setup
    let t1 = Try.success<any>(1);
    let t2 = Try.success<any>({ '1': 1, '2': 2 });
    let m1 = Maybe.some<any>(1);
    let m2 = Maybe.nothing();
    
    /// When
    let t1c = t1.cast(Number);
    let t2c = t2.cast(Array);
    let m1c = m1.cast(Number);
    let m2c = m2.cast(Array);

    /// Then
    expect(t1c.value).toBe(1);
    expect(m1c.value).toBe(1);
    expect(t2c.isFailure()).toBeTruthy();
    expect(m2c.isNothing()).toBeTruthy();
  });

  it('Maybe/Try filter should work correctly', () => {
    /// Setup
    let t1 = Try.success(1);
    let t2 = Try.success(2);
    let m1 = Maybe.some(3);
    let m2 = Maybe.nothing();
    let isEven = Numbers.isEven;
    let isOdd = Numbers.isOdd;

    /// When
    let t1f = t1.filter(isEven, 'Error!');
    let t2f = t2.filter(isOdd, 'Error!');
    let m1f = m1.filter(isOdd);
    let m2f = m2.filter(isEven);

    /// Then
    expect(t1f.isFailure()).toBeTruthy();
    expect(t2f.isFailure()).toBeTruthy();
    expect(m1f.value).toBe(3);
    expect(m2f.isNothing()).toBeTruthy();
  });
});