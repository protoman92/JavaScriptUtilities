import { Collections, Numbers } from './../src';

describe('Number utilities should work correctly', () => {
  it('Number range should work correctly', () => {
    /// Setup
    let times = 1000;
    let current = 0;
    let startValues = [1, 2, 4, 5, 7];
    let endValues = [1000, 2000, 4000, 5000, 7000];
    let deltaValues = [13, 19, 23, 37];

    while (current < times) {
      let start = Collections.randomElement(startValues).getOrThrow();
      let end = Collections.randomElement(endValues).getOrThrow();
      let delta = Collections.randomElement(deltaValues).getOrThrow();

      /// When
      let ranged = Numbers.range(start, end, delta);
      
      /// Then
      let first = Collections.first(ranged);
      let last = Collections.last(ranged);
      expect(first.value).toBe(start);
      expect(last.value).toBeLessThanOrEqual(end);

      current += 1;
    }
  });

  it('Number randomBetween should work correctly', () => {
    /// Setup
    let lower = 10;
    let upper = 15;
    let times = 10000;
    
    /// When
    let randomized = Numbers
      .range(0, times)
      .map(() => Numbers.randomBetween(lower, upper));

    /// Then
    expect(randomized.every(value => value >= 10 && value <= 15)).toBeTruthy();
  });
});