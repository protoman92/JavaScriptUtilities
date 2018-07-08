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

  it('Deleting object keys unsafely - should delete keys for original object', () => {
    /// Setup
    let object = { id: 1, name: 2, age: 3 };

    /// When
    let resultingObject = Objects.deleteKeysUnsafely(object, 'id', 'name');

    /// Then
    expect(resultingObject.age).toEqual(object.age);
    expect(object.id).toBeFalsy();
    expect(object.name).toBeFalsy();
  });

  it('Deleting object keys safely - should not delete keys for original', () => {
    /// Setup
    let object = { id: 1, name: 2, age: 3 };

    /// When
    let resultingObject = Objects.deletingKeys(object, 'id', 'name');

    /// Then
    expect(resultingObject.age).toEqual(object.age);
    expect(object.id).toBeTruthy();
    expect(object.name).toBeTruthy();
  });
});
