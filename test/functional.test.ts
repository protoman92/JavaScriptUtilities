import {
  Maybe,  
  MaybeMap,
  MaybeFlatMap,
  Try,
  TryMap,
  TryFlatMap
} from './../src';

describe('Maybe should be implemented correctly', () => {
  it('Maybe getOrThrow and getOrElse should be correct', () => {
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

  it('Maybe map should be correct', () => {
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

  it('Maybe flatMap should be correct', () => {
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
});

describe('Try should be implemented correctly', () => {
  it('Try getOrThrow should be correct', () => {
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

  it('Try map should be correct', () => {
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

  it('Try flatMap should be correct', () => {
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

  it('Try zipAll with error should be correct', () => {
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
});