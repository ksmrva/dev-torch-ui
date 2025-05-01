import { ComparableEntity } from "../../../../../shared/comparable-entity";
import { DeserializableEntity } from "../../../../../shared/deserializable-entity";

// This class purposefully does not extend ApiEntity since it is not a true entity as it doesn"t have an ID or Audit Field values
export class SqlDatabaseDetailPath implements DeserializableEntity<SqlDatabaseDetailPath>, ComparableEntity<SqlDatabaseDetailPath> {

  databaseName: string;

  schemaName: string;

  private fullPath: string;

  constructor() {
    this.databaseName = "";
    this.schemaName = "";
    this.fullPath = "";
  }

  getFullPath(): string {
    if (!this.fullPath || this.fullPath === "") {
      this.fullPath = this.createFullPath();
    }
    return this.fullPath;
  }

  deserialize(json: any): SqlDatabaseDetailPath {
    if (json) {
      this.databaseName = json.databaseName;
      this.schemaName = json.schemaName;
    }
    return this;
  }

  isEqualTo(otherEntity: SqlDatabaseDetailPath): boolean {
    let isEqualTo = false;
    if (this.databaseName === otherEntity.databaseName
      && this.schemaName === otherEntity.schemaName
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

  private createFullPath(): string {
    let fullPathValue = "";
    if (this.databaseName) {
      fullPathValue += this.databaseName;
    }
    if (this.schemaName) {
      if (fullPathValue !== "") {
        fullPathValue += ".";
      }
      fullPathValue += this.schemaName;
    }
    return fullPathValue;
  }

}
