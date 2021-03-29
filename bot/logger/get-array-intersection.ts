export function getArrayIntersection<T, K>(firsts: T[], seconds: K[]): (T&K)[] {
  return firsts.filter((first: T): boolean => seconds.includes(first as any as K)) as any as (T&K)[];
}
