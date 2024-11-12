import { ApiEntity } from "../../api-entity";
import { DbModelName } from "./name/db-model-name";
import { DbTableModel } from "./table/db-table-model";

export class DbModel extends ApiEntity {

  name: DbModelName;

  description: string;

  tables: DbTableModel[];

  constructor() {
    super();

    this.name = new DbModelName();
    this.description = "";
    this.tables = [];
  }

  createHtmlTableIdForDatabaseTable(tableModel: DbTableModel): string {
    let htmlId = this.createHtmlIdForCanvasElement();

    let tableComponentForId = tableModel.getHtmlIdForElement();
    htmlId = htmlId + "_" + tableComponentForId;

    return htmlId;
  }

  createHtmlTableHeaderIdForDatabaseTable(table: DbTableModel): string {
    return "";
  }

  createHtmlTableBodyIdForDatabaseTable(table: DbTableModel): string {
    return "";
  }

  createHtmlIdForCanvasElement(): string {
    return "DbModel." + this.name.getFullName();
  }

  override deserialize(json: any): DbModel {
    super.deserialize(json);
    if (json) {
      this.name = new DbModelName().deserialize(json.name);
      this.description = json.description;

      this.tables = [];
      let jsonForTables: any[] = json.tables;
      if (jsonForTables) {
        jsonForTables.forEach((jsonForTable: any) => {
          let tableModel = new DbTableModel().deserialize(jsonForTable);
          if (tableModel) {
            this.tables.push(tableModel);
          } else {
            console.log("Tried to convert JSON for Table Model [" + jsonForTable + "] into an Object but received a null");
          }
        });
      }
    }
    return this;
  }

  override isEqualTo(otherEntity: DbModel): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo
      && this.name.isEqualTo(otherEntity.name)
      && this.description === otherEntity.description
      && this.tables.length === otherEntity.tables.length
    ) {
      let allTablesHaveMatch = true;
      for (let i = 0; i < this.tables.length; i++) {
        let table = this.tables[i];
        let indexOfTable = otherEntity.tables.findIndex((otherTable: DbTableModel) => {
          return table.isEqualTo(otherTable);
        });
        if (indexOfTable < 0) {
          allTablesHaveMatch = false;
          break;
        }
      }
      isEqualTo = allTablesHaveMatch;
    }
    return isEqualTo;
  }

}
