import {Never, PartialProp, RequiredProp, Types, Unpacked} from './../src';

interface TestInterface {
  func1: () => boolean;
  func2: () => number;
  func3: () => string;
  value1: Never<string>;
  value2: Never<string>;
}

class TestInterfaceImpl implements TestInterface {
  func1 = (): boolean => true;
  func2 = (): number => 1;
  func3 = (): string => '123';
  value1 = undefined;

  // tslint:disable-next-line:no-null-keyword
  value2 = null;
}

describe('Types should be implemented correctly', () => {
  it('Types check should work correctly', () => {
    /// Setup
    let impl: any = new TestInterfaceImpl();

    /// When & Then 1
    if (Types.isInstance<TestInterface>(impl, 'func1')) {
      expect(impl.func1()).toBeTruthy();
    } else {
      fail();
    }

    /// When & Then 2
    if (Types.isInstance<TestInterface>(impl, 'func1', 'func2')) {
      expect(impl.func2()).toBe(1);
    } else {
      fail();
    }

    /// When & Then 3
    if (Types.isInstance<TestInterface>(impl, 'func1', 'func2', 'func3')) {
      expect(impl.func3()).toBe('123');
    } else {
      fail();
    }

    /// When & Then 4
    if (Types.isInstance<TestInterface>(impl, 'value1', 'value2')) {
      expect(impl.value1).toBeUndefined();
      expect(impl.value2).toBeNull();
    } else {
      fail();
    }
  });

  it('Partial prop should work correctly', () => {
    /// Setup
    type A = Readonly<{a: string; b: boolean; c: number}>;
    type SomePartial = PartialProp<A, 'a' | 'b'>;
    type AllPartial = PartialProp<A>;
    let a: SomePartial = {c: 2};
    let b: AllPartial = {};

    /// When && Then
    expect(a.a).toBeUndefined();
    expect(a.b).toBeUndefined();
    expect(a.c).toBeDefined();
    expect(Object.keys(b)).toHaveLength(0);
  });

  it('Required prop should work correctly', () => {
    /// Setup
    type A = Partial<Readonly<{a: string; b: boolean; c: number}>>;
    type SomeRequired = RequiredProp<A, 'a' | 'b'>;
    type AllRequired = RequiredProp<A>;
    let a: SomeRequired = {a: '1', b: false};
    let b: AllRequired = {a: '1', b: false, c: 2};

    /// When && Then
    expect(a.a).toBeDefined();
    expect(a.b).toBeDefined();
    expect(a.c).toBeUndefined();
    expect(Object.keys(b)).toHaveLength(3);
  });

  it('Unpacked types should work correctly', () => {
    /// Setup
    const u1: Unpacked<Promise<number>> = 1;
    const u2: Unpacked<number[]> = 1;
    const u3: Unpacked<{[K: string]: number}> = 1;
    const u4: Unpacked<() => number> = 1;

    /// When && Then
    expect(u1).toEqual(1);
    expect(u2).toEqual(1);
    expect(u3).toEqual(1);
    expect(u4).toEqual(1);
  });
});
