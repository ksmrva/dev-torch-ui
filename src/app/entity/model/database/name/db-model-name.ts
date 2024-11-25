import { ComparableEntity } from "../../../comparable-entity";
import { DeserializableEntity } from "../../../deserializable-entity";

// This class purposefully does not extend ApiEntity since it is not a true entity as it doesn"t have an ID or Audit Field values
export class DbModelName implements DeserializableEntity<DbModelName>, ComparableEntity<DbModelName> {

  databaseName: string;

  schemaName: string;

  private fullName: string;

  constructor() {
    this.databaseName = "";
    this.schemaName = "";
    this.fullName = "";
  }

  getFullName(): string {
    if (!this.fullName || this.fullName === "") {
      this.fullName = this.createFullName();
    }
    return this.fullName;
  }

  deserialize(json: any): DbModelName {
    if (json) {
      this.databaseName = json.databaseName;
      this.schemaName = json.schemaName;
    }
    return this;
  }

  isEqualTo(otherEntity: DbModelName): boolean {
    let isEqualTo = false;
    if (this.databaseName === otherEntity.databaseName
      && this.schemaName === otherEntity.schemaName
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

  private createFullName(): string {
    let stringValue = "";
    if (this.databaseName) {
      stringValue += this.databaseName;
    }
    if (this.schemaName) {
      if (stringValue !== "") {
        stringValue += ".";
      }
      stringValue += this.schemaName;
    }
    return stringValue;
  }
}
