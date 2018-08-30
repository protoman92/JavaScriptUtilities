import {Numbers, Strings} from './../src';

describe('String utilities should work correctly', () => {
  it('String random should work correctly', () => {
    Numbers.range(0, 100).forEach(() => {
      let length = Numbers.randomBetween(10, 1000);
      let random = Strings.randomString(length);
      expect(random.length).toBe(length);
    });
  });
});
