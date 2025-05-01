export interface ComparableEntity<T> {
  isEqualTo(otherEntity: T): boolean;
}
