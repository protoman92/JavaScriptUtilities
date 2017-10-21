import BuilderType from './BuilderType';

export default interface BuildableType<Builder extends BuilderType<any>> {
  
  /**
   * Create a new builder instance.
   * @returns Builder A new builder instance.
   */
  builder(): Builder;

  /**
   * Create a new builder instance and copy all properties to simulate cloning.
   * @return Builder A new builder instance.
   */
  cloneBuilder(): Builder;
}