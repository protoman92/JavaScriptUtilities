export function isInstance<R>(object: any, member: string): object is R {
  return member in object;
}