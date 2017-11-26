import { BuildableType, BuilderType } from './../src';

export class Buildable implements BuildableType<Builder> {
  a?: string;
  b?: string;
  c?: string;

  builder(): Builder {
    return new Builder();
  }

  cloneBuilder(): Builder {
    return this.builder().withBuildable(this);
  }
}

export class Builder implements BuilderType<Buildable> {
  private buildable: Buildable;

  constructor() {
    this.buildable = new Buildable();
  }

  withA(a?: string): this {
    this.buildable.a = a;
    return this;
  }

  withB(b?: string): this {
    this.buildable.b = b;
    return this;
  }

  withC(c?: string): this {
    this.buildable.c = c;
    return this;
  }

  withBuildable(buildable?: Buildable): this {
    if (buildable !== undefined && buildable !== null) {
      return this
        .withA(buildable.a)
        .withB(buildable.b)
        .withC(buildable.c);
    } else {
      return this;
    }
  }

  build(): Buildable {
    return this.buildable;
  }
}

describe('Test buildable', () => {
  it('Clone builder should clone an object without mutations', () => {
    // Setup
    let obj1 = new Buildable();
    obj1.a = "a";
    obj1.b = "b";
    obj1.c = "c";

    // When
    let obj2 = obj1.cloneBuilder().build();

    // Then
    expect(obj2.a).toBe(obj1.a);
    expect(obj2.b).toBe(obj1.b);
    expect(obj2.c).toBe(obj1.c);
    expect(obj2).toEqual(obj1);
  });
});
