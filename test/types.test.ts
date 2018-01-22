import { Nullable, Types } from './../src';

interface TestInterface {
  func1: () => boolean;
  func2: () => number;
  func3: () => string;
  value1: Nullable<string>;
  value2: Nullable<string>;
}

class TestInterfaceImpl implements TestInterface {
  func1 = (): boolean => true;
  func2 = (): number => 1;
  func3 = (): string => '123';
  value1 = undefined;
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
    if (Types.isInstance<TestInterface>(impl, 'func4')) {
      fail();
    } else {
      console.log('Passed this test too!');
    }

    /// When & Then 4
    if (Types.isInstance<TestInterface>(impl, 'value1', 'value2')) {
      expect(impl.value1).toBeUndefined();
      expect(impl.value2).toBeNull();
    } else {
      fail();
    }
  });
});