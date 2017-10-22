import { Collections } from './../src';

describe('Collection utils should work', () => {
  it('Array first should be correct', () => {
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
});