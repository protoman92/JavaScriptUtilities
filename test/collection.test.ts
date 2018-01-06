import { Collections, Maybe, Numbers, Try, TryResult } from './../src';

describe('Collection utils should work', () => {
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
});