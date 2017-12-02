import { Types } from './../src';

interface TestInterface {
  func1: () => boolean;
  func2: () => number;
  func3: () => string;
}

class TestInterfaceImpl implements TestInterface {
  func1 = (): boolean => true;
  func2 = (): number => 1;
  func3 = (): string => '123';
}

describe('Types should be implemented correctly', () => {
  it('Types check should work correctly', () => {
    /// Setup
    let impl: any = new TestInterfaceImpl();

    /// When & Then 1
    if (Types.isInstance<TestInterface>(impl, ['func1'])) {
      expect(impl.func1()).toBeTruthy();
    } else {
      fail();
    }

    /// When & Then 2
    if (Types.isInstance<TestInterface>(impl, ['func1', 'func2'])) {
      expect(impl.func2()).toBe(1);
    } else {
      fail();
    }

    /// When & Then 3
    if (Types.isInstance<TestInterface>(impl, ['func1', 'func2', 'func3'])) {
      expect(impl.func3()).toBe('123');
    } else {
      fail();
    }

    /// When & Then 4
    if (Types.isInstance<TestInterface>(impl, ['func4'])) {
      fail();
    } else {
      console.log('Passed this test too!');
    }
  });
});