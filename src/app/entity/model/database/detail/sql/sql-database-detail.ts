import { ApiEntity } from "../../../../api-entity";
import { SqlDatabaseDetailPath } from "./path/sql-database-path";
import { SqlTableDetail } from "./table/sql-table-detail";

export class SqlDatabaseDetail extends ApiEntity {

  name: SqlDatabaseDetailPath;

  description: string;

  tables: SqlTableDetail[];

  constructor() {
    super();

    this.name = new SqlDatabaseDetailPath();
    this.description = "";
    this.tables = [];
  }

  createHtmlTableIdForDatabaseTable(table: SqlTableDetail): string {
    let htmlId = this.createHtmlIdForCanvasElement();

    let htmlIdForTable = table.getHtmlIdForElement();
    htmlId = htmlId + "_" + htmlIdForTable;

    return htmlId;
  }

  createHtmlTableHeaderIdForDatabaseTable(table: SqlTableDetail): string {
    return "";
  }

  createHtmlTableBodyIdForDatabaseTable(table: SqlTableDetail): string {
    return "";
  }

  createHtmlIdForCanvasElement(): string {
    return "SqlDatabaseDetail." + this.name.getFullPath();
  }

  override deserialize(json: any): SqlDatabaseDetail {
    super.deserialize(json);
    if (json) {
      this.name = new SqlDatabaseDetailPath().deserialize(json.name);
      this.description = json.description;

      this.tables = [];
      let jsonForTables: any[] = json.tables;
      if (jsonForTables) {
        jsonForTables.forEach((jsonForTable: any) => {
          let tableDetail = new SqlTableDetail().deserialize(jsonForTable);
          if (tableDetail) {
            this.tables.push(tableDetail);
          } else {
            console.log("Tried to convert JSON for Table Detail [" + jsonForTable + "] into an Object but received a null");
          }
        });
      }
    }
    return this;
  }

  override isEqualTo(otherEntity: SqlDatabaseDetail): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(
        this.name.isEqualTo(otherEntity.name)
        && this.description === otherEntity.description
        && this.tables.length === otherEntity.tables.length) {
        let allTablesHaveMatch = true;
        for (let i = 0; i < this.tables.length; i++) {
          let table = this.tables[i];
          let indexOfTable = otherEntity.tables.findIndex((otherTable: SqlTableDetail) => {
            return table.isEqualTo(otherTable);
          });
          if (indexOfTable < 0) {
            allTablesHaveMatch = false;
            break;
          }
        }
        isEqualTo = allTablesHaveMatch;

      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
