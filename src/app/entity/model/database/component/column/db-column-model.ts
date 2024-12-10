import { ApiEntity } from "../../../../api-entity";
import { DbModelSourceDataType } from "../../source/type/db-model-source-data-type";
import { DbColumnCategory } from "./category/db-column-category";

export class DbColumnModel extends ApiEntity {

  tableId: number;

  name: string;

  description: string;

  dataType: DbModelSourceDataType;

  columnCategory: DbColumnCategory;

  isNullable: boolean;

  isAutoIncrement: boolean;

  columnIndex: number;

  constructor() {
    super();

    this.tableId = -1;
    this.name = "";
    this.description = "";
    this.dataType = new DbModelSourceDataType();
    this.columnCategory = new DbColumnCategory();
    this.isNullable = false;
    this.isAutoIncrement = false;
    this.columnIndex = -1;
  }

  getHtmlIdForElement(): string {
    return "DbColumnModel." + this.name;
  }

  override deserialize(json: any): DbColumnModel {
    super.deserialize(json);
    if (json) {
      this.tableId = json.tableId;
      this.name = json.name;
      this.description = json.description;
      this.dataType = new DbModelSourceDataType().deserialize(json.dataType);
      this.columnCategory = new DbColumnCategory().deserialize( json.columnCategory );
      this.isNullable = json.isNullable;
      this.isAutoIncrement = json.isAutoIncrement;
      this.columnIndex = json.columnIndex;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbColumnModel): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.tableId === otherEntity.tableId
        && this.name === otherEntity.name
        && this.description === otherEntity.description
        && this.dataType.isEqualTo(otherEntity.dataType)
        && this.columnCategory.isEqualTo(otherEntity.columnCategory)
        && this.isNullable === otherEntity.isNullable
        && this.isAutoIncrement === otherEntity.isAutoIncrement
        && this.columnIndex === otherEntity.columnIndex) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
