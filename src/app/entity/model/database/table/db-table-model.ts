import { ApiEntity } from "../../../api-entity";
import { DbColumnModel } from "../column/db-column-model";
import { DbForeignKeyModel } from "../constraint/key/foreign/db-foreign-key-model";
import { DbPrimaryKeyModel } from "../constraint/key/primary/db-primary-key-model";
import { DbTableCategory } from "./category/db-table-category";

export class DbTableModel extends ApiEntity {

  name: string;

  description: string;

  columns: DbColumnModel[];

  primaryKey: DbPrimaryKeyModel;

  foreignKeys: DbForeignKeyModel[];

  tableCategory: DbTableCategory;

  constructor() {
    super();

    this.name = "";
    this.description = "";
    this.columns = [];
    this.primaryKey = new DbPrimaryKeyModel();
    this.foreignKeys = [];
    this.tableCategory = new DbTableCategory();
  }

  getHtmlIdForElement(): string {
    return "DbTableModel." + this.name;
  }

  override deserialize(json: any): DbTableModel {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.description = json.description;
      this.primaryKey = new DbPrimaryKeyModel().deserialize(json.primaryKey);
      this.tableCategory = new DbTableCategory().deserialize(json.tableCategory);

      this.columns = [];
      let jsonForColumns: any[] = json.columns;
      if (jsonForColumns) {
        jsonForColumns.forEach((jsonForColumn: any) => {
          let column = new DbColumnModel().deserialize(jsonForColumn);
          if (column) {
            this.columns.push(column);
          } else {
            console.log( "Tried to convert JSON for Column Model [" + jsonForColumn + "] into an Object but received a null" );
          }
        });
      }

      this.foreignKeys = [];
      let jsonForForeignKeys: any[] = json.foreignKeys;
      if (jsonForForeignKeys) {
        jsonForForeignKeys.forEach((jsonForForeignKey: any) => {
          let foreignKey = new DbForeignKeyModel().deserialize( jsonForForeignKey );
          if (foreignKey) {
            this.foreignKeys.push(foreignKey);
          } else {
            console.log( "Tried to convert JSON for Foreign Key Model [" + jsonForForeignKey + "] into an Object but received a null" );
          }
        });
      }
    }
    return this;
  }

  override isEqualTo(otherEntity: DbTableModel): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.description === otherEntity.description
        && this.columns.length === otherEntity.columns.length
        && this.primaryKey.isEqualTo(otherEntity.primaryKey)
        && this.foreignKeys.length === otherEntity.foreignKeys.length
        && this.tableCategory.isEqualTo(otherEntity.tableCategory)) {

        let allColumnsHaveMatch = true;
        for (let i = 0; i < this.columns.length; i++) {
          let columnModel = this.columns[i];
          let indexOfColumn = otherEntity.columns.findIndex(
            (otherColumn: DbColumnModel) => {
              return columnModel.isEqualTo(otherColumn);
            }
          );
          if (indexOfColumn < 0) {
            allColumnsHaveMatch = false;
            break;
          }
        }

        let allForeignKeysHaveMatch = true;
        for (let i = 0; i < this.foreignKeys.length; i++) {
          let foreignKey = this.foreignKeys[i];
          let indexOfForeignKey = otherEntity.foreignKeys.findIndex(
            (otherForeignKey: DbForeignKeyModel) => {
              return foreignKey.isEqualTo(otherForeignKey);
            }
          );
          if (indexOfForeignKey < 0) {
            allForeignKeysHaveMatch = false;
            break;
          }
        }

        isEqualTo = allColumnsHaveMatch && allForeignKeysHaveMatch;

      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
