export type SortOrder = "asc" | "desc";
export type Comparator<T> = (a: T, b: T) => number;
export class SortUtils {

  static sortNumbersAsc(numbers: number[]): number[] {
    return [...numbers].sort((a, b) => a - b);
  }

  static extractProperty<T, K extends keyof T>(
    items: T[],
    property: K,
  ): T[K][] {
    return items.map((item) => item[property]);
  }
}
