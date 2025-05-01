export interface DeserializableEntity<T> {
  deserialize(json: any): T;
}
