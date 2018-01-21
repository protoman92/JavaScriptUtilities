import { Collections, Maybe, Numbers, Try, TryResult } from './../src';

describe('Collection utils should work correctly', () => {
  it('Array first should work correctly', () => {
    /// Setup
    let a1: number[] = [];
    let a2 = [1, 2, 3];

    /// When
    let first1 = Collections.first(a1);
    let first2 = Collections.first(a2, (value) => value % 2 === 0);

    /// Then
    expect(first1.isNothing()).toBeTruthy();
    expect(first2.value).toBe(2);
  });

  it('Array last should work correctly', () => {
    /// Setup
    let a1: number[] = [];
    let a2 = [1, 2, 3, 4, 5];

    /// When
    let first1 = Collections.last(a1);
    let first2 = Collections.last(a2, (value) => value % 2 === 0);

    /// Then
    expect(first1.isNothing()).toBeTruthy();
    expect(first2.value).toBe(4);
    expect(a2).toEqual([1, 2, 3, 4, 5]);
  });

  it('Array elementAt should work correctly', () => {
    /// Setup & When & Then
    expect(Collections.elementAtIndex([], 0).isNothing()).toBeTruthy();
    expect(Collections.elementAtIndex([1, 2, 3], 4).isNothing).toBeTruthy();
    expect(Collections.elementAtIndex([1, 2, 3, 4], 3).value).toBe(4);
  });

  it('Array flatMap should work correctly', () => {
    /// Setup
    let array1: TryResult<number>[] = [
      Maybe.some(1), 
      Maybe.nothing(), 
      Try.failure('Error!'),
      ...(Numbers.range(2, 10)),
      Try.success(10)
    ];

    /// When
    let array2 = Collections.flatMap(array1);

    /// Then
    expect(array2).toEqual(Numbers.range(1, 11));
  });

  it('Zip two arrays should work correctly', () => {
    /// Setup
    let array1 = [1, 2, 3, 4, 5];
    let array2 = [1, 2, 3];

    /// When
    let result = Collections.zip(array1, array2, (v1, v2) => v1 + v2);

    /// Then
    expect(result.value).toEqual([2, 4, 6]);
  });

  it('Zip all arrays should work correctly', () => {
    /// Setup
    let array1 = [1, 2, 3, 4, 5];
    let array2 = [1, 2, 3];
    let array3 = [1, 2, 3, 4, 5, 6, 7];
    let selector: (v: number[]) => number = v => v.reduce((v1, v2) => v1 + v2);

    /// When
    let result1 = Collections.zipAll([array1, array2, array3], selector);
    let result2 = Collections.zipVarargs(selector, array1, array2, array3);

    /// Then
    expect(result1.value).toEqual([3, 6, 9]);
    expect(result1.value).toEqual(result2.value);
  });

  it('Getting index of item - should work correctly', () => {
    /// Setup
    let a1 = [1, 2, 3, 4, 5, 6];
    let a2 = [1, 2, 3, 4, 5, 6, 7];

    /// When
    let a1i = Collections.indexOf(a1, 6);
    let a2i = Collections.indexOf(a2, 2, (v1, v2) => v1 - v2 === 1);

    /// Then
    expect(a1i.value).toBe(a1.length - 1);
    expect(a2i.value).toBe(0);
  });

  it('Checking Array contains - should work correctly', () => {
    /// Setup
    let a1 = [1, 2, 3, 4, 5, 6];
    let a2 = [1, 2, 3, 4, 5, 6, 7];

    /// When
    let a1c = Collections.contains(a1, 3);
    let a2c = Collections.contains(a2, 5, (v1, v2) => v1 === v2);

    /// Then
    expect(a1c).toBeTruthy();
    expect(a2c).toBeTruthy();
  });

  it('Finding unique items in Array - should work correctly', () => {
    /// Setup
    let a1 = [1, 1, 2, 2, 3, 4, 5, 5];
    let a2 = [1, 2, 2, 3, 4, 5, 6, 6];

    /// When
    let a1u = Collections.unique(a1);
    let a2u = Collections.unique(a2, (v1, v2) => v1 === v2);

    /// Then
    expect(a1u).toEqual([1, 2, 3, 4, 5]);
    expect(a2u).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('Collection random element - should work correctly', () => {
    /// Setup
    let array = [1, 2];
    let randomized: number[] = [];

    /// When
    for (let _i in Numbers.range(1, 1000)) {
      randomized.push(Collections.randomElement(array).getOrThrow());
    }

    /// Then
    expect(Collections.unique(randomized).length).toBe(array.length);
  });

  it('Collection split/splitMap - should work correctly', () => {
    /// Setup
    let array = [1, 2, 3, 4, 5];

    let selector: (v: number) => boolean = v => {
      switch (v) {
        case 1: throw new Error('1 received!');
        case 2: return true;
        case 3: return false;
        case 4: return true;
        case 5: return false;
        default: throw new Error('Unexpected');
      }
    };

    /// When
    let split = Collections.split(array, selector);

    /// Then
    let split1 = split[0];
    let split2 = split[1];
    expect(split1).toEqual([2, 4]);
    expect(split2).toEqual([1, 3, 5]);
  });
});