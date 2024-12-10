import { ApiEntity } from "../../../../../../api-entity";

export class DbForeignKeyModel extends ApiEntity {

  name: string;

  description: string;

  localColumnId: number;

  referencedTableId: number;

  referencedColumnId: number;

  constructor() {
    super();

    this.name = "";
    this.description = "";
    this.localColumnId = -1;
    this.referencedTableId = -1;
    this.referencedColumnId = -1;
  }

  override deserialize(json: any): DbForeignKeyModel {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.description = json.description;
      this.localColumnId = json.localColumn.id;
      this.referencedTableId = json.referencedTable.id;
      this.referencedColumnId = json.referencedColumn.id;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbForeignKeyModel): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.description === otherEntity.description
        && this.localColumnId === otherEntity.localColumnId
        && this.referencedTableId === otherEntity.referencedTableId
        && this.referencedColumnId === otherEntity.referencedColumnId) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
