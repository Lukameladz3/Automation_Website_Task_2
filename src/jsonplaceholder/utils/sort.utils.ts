export type SortOrder = "asc" | "desc";
export type Comparator<T> = (a: T, b: T) => number;
export class SortUtils {
  static sortNumbers(numbers: number[], order: SortOrder = "asc"): number[] {
    return [...numbers].sort((a, b) => {
      return order === "asc" ? a - b : b - a;
    });
  }

  static extractProperty<T, K extends keyof T>(
    items: T[],
    property: K,
  ): T[K][] {
    return items.map((item) => item[property]);
  }
}
