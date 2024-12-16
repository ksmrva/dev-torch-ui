import { ApiEntity } from "../../../../../api-entity";
import { DbCollectionCategory } from "../../category/collection/db-collection-category";
import { SqlColumnDetail } from "../column/sql-column-detail";
import { SqlForeignKeyDetail } from "../constraint/key/foreign/sql-foreign-key-detail";
import { SqlPrimaryKeyDetail } from "../constraint/key/primary/sql-primary-key-detail";

export class SqlTableDetail extends ApiEntity {

  name: string;

  description: string;

  columns: SqlColumnDetail[];

  primaryKey: SqlPrimaryKeyDetail;

  foreignKeys: SqlForeignKeyDetail[];

  tableCategory: DbCollectionCategory;

  constructor() {
    super();

    this.name = "";
    this.description = "";
    this.columns = [];
    this.primaryKey = new SqlPrimaryKeyDetail();
    this.foreignKeys = [];
    this.tableCategory = new DbCollectionCategory();
  }

  getHtmlIdForElement(): string {
    return "SqlTableDetail." + this.name;
  }

  override deserialize(json: any): SqlTableDetail {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.description = json.description;
      this.primaryKey = new SqlPrimaryKeyDetail().deserialize(json.primaryKey);
      this.tableCategory = new DbCollectionCategory().deserialize(json.tableCategory);

      this.columns = [];
      let jsonForColumns: any[] = json.columns;
      if (jsonForColumns) {
        jsonForColumns.forEach((jsonForColumn: any) => {
          let column = new SqlColumnDetail().deserialize(jsonForColumn);
          if (column) {
            this.columns.push(column);
          } else {
            console.log( "Tried to convert JSON for SQL Column Detail [" + jsonForColumn + "] into an Object but received a null" );
          }
        });
      }

      this.foreignKeys = [];
      let jsonForForeignKeys: any[] = json.foreignKeys;
      if (jsonForForeignKeys) {
        jsonForForeignKeys.forEach((jsonForForeignKey: any) => {
          let foreignKey = new SqlForeignKeyDetail().deserialize( jsonForForeignKey );
          if (foreignKey) {
            this.foreignKeys.push(foreignKey);
          } else {
            console.log( "Tried to convert JSON for SQL Foreign Key Detail [" + jsonForForeignKey + "] into an Object but received a null" );
          }
        });
      }
    }
    return this;
  }

  override isEqualTo(otherEntity: SqlTableDetail): boolean {
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
          let columnDetail = this.columns[i];
          let indexOfColumn = otherEntity.columns.findIndex(
            (otherColumn: SqlColumnDetail) => {
              return columnDetail.isEqualTo(otherColumn);
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
            (otherForeignKey: SqlForeignKeyDetail) => {
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
