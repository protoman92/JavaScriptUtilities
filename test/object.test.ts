import { Objects, JSObject } from './../src';

describe('Object utils should be implemented correctly', () => {
  it('Object entries should work correctly', () => {
    /// Setup
    let object: JSObject<string> = { a: 'a', b: 'b', c: 'c', d: undefined };

    /// When
    let entries = Objects.entries(object);
    let map = Objects.toMap(object);

    /// Then
    expect(entries.some(v => v[0] === 'a')).toBeTruthy();
    expect(entries.some(v => v[0] === 'b')).toBeTruthy();
    expect(entries.some(v => v[0] === 'c')).toBeTruthy();
    expect(entries.some(v => v[0] === 'd')).toBeTruthy();
    expect(map.keys()).toContain('a');
    expect(map.keys()).toContain('b');
    expect(map.keys()).toContain('c');
    expect(map.keys()).toContain('d');
  });
});
