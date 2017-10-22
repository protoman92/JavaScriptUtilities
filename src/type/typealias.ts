/// Represent a indexable key-value JS object.
export type JSObject<T> = { [key: string] : T };
export type Nullable<T> = T | undefined;