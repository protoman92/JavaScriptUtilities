export interface BuilderType<Buildable extends BuildableType<any>> {
  /**
   * Copy properties from one buildable to another.
   * @param {Buildable} buildable A buildable instance.
   * @returns {this} The current builder instance.
   */
  withBuildable(buildable?: Buildable): this;

  /**
   * Get the associated buildable.
   * @returns {Buildable} A buildable instance.
   */
  build(): Buildable;
}

export interface BuildableType<Builder extends BuilderType<any>> {
  /**
   * Create a new builder instance.
   * @returns {Builder} A new builder instance.
   */
  builder(): Builder;

  /**
   * Create a new builder instance and copy all properties to simulate cloning.
   * @return {Builder} A new builder instance.
   */
  cloneBuilder(): Builder;
}
