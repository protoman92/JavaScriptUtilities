import {
  ArgumentType,
  CtorArgumentType,
  CustomValueType,
  Never,
  PartialProp,
  RequiredProp,
  Types,
} from './../src';

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

  it('Custom value type should work correctly', () => {
    /// Setup
    type A = Readonly<{a: string; b: boolean; c: object}>;
    let a: CustomValueType<A, number> = {a: 1, b: 2, c: 3};
    let b: CustomValueType<A, number, 'b' | 'c'> = {a: '1', b: 2, c: 3};

    /// When && Then
    expect(a).toBeDefined();
    expect(b).toBeDefined();
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

  it('Argument types should work correctly', () => {
    /// Setup
    type Func = (a: number, b: boolean, c?: string) => void;
    type FuncArg = ArgumentType<Func>;
    let a: FuncArg[0] = 2;
    let b: FuncArg[1] = true;
    let c: FuncArg[2] = '1';

    /// When && Then
    expect(typeof a === 'number').toBeTruthy();
    expect(typeof b === 'boolean').toBeTruthy();
    expect(typeof c === 'string').toBeTruthy();
  });

  it('Constructor argument types should work correctly', () => {
    /// Setup
    class CtorObject {
      constructor(_a: number, _b: boolean, _c?: string) {}
    }

    type CtorArg = CtorArgumentType<typeof CtorObject>;
    let a: CtorArg[0] = 2;
    let b: CtorArg[1] = true;
    let c: CtorArg[2] = '1';

    /// When && Then
    expect(typeof a === 'number').toBeTruthy();
    expect(typeof b === 'boolean').toBeTruthy();
    expect(typeof c === 'string').toBeTruthy();
  });
});
