import BuildableType from './BuildableType';

interface BuilderType<Buildable extends BuildableType<any>> {

  /**
   * Copy properties from one buildable to another.
   * @param  {Buildable} buildable A buildable instance.
   * @returns this The current builder instance.
   */
  withBuildable(buildable?: Buildable): this;

  /**
   * Get the associated buildable.
   * @returns Buildable A buildable instance.
   */
  build(): Buildable;
}

export default BuilderType;