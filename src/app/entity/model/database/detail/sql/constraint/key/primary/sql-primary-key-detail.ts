import { ApiEntity } from "../../../../../../../api-entity";
import { SqlPrimaryKeyColumnDetail } from "../../../../../detail/sql/constraint/key/primary/column/sql-primary-key-column-detail";

export class SqlPrimaryKeyDetail extends ApiEntity {

  name: string;

  description: string;

  primaryKeyColumns: SqlPrimaryKeyColumnDetail[];

  constructor() {
    super();

    this.name = "";
    this.description = "";
    this.primaryKeyColumns = [];
  }

  override deserialize(json: any): SqlPrimaryKeyDetail {
    super.deserialize(json);
    if (json) {
      this.id = json.id;
      this.name = json.name;
      this.description = json.description;

      this.primaryKeyColumns = [];
      let jsonForPrimaryKeyColumns: any[] = json.primaryKeyColumns;
      if (jsonForPrimaryKeyColumns) {
        jsonForPrimaryKeyColumns.forEach((jsonForPrimaryKeyColumn: any) => {
            let primaryKeyColumn = new SqlPrimaryKeyColumnDetail().deserialize( jsonForPrimaryKeyColumn );
            if (primaryKeyColumn) {
              this.primaryKeyColumns.push(primaryKeyColumn);
            } else {
              console.log( "Tried to convert JSON for SQL Primary Key Column Detail [" + jsonForPrimaryKeyColumn + "] into an Object but received a null" );
            }
          }
        );
      }
      this.createdUid = json.createdUid;
      this.createdDate = json.createdDate;
      this.modifiedUid = json.modifiedUid;
      this.modifiedDate = json.modifiedDate;
    }
    return this;
  }

  override isEqualTo(otherEntity: SqlPrimaryKeyDetail): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.description === otherEntity.description
        && this.primaryKeyColumns.length === otherEntity.primaryKeyColumns.length) {

        let allPrimaryKeyColumnsHaveMatch = true;
        for (let i = 0; i < this.primaryKeyColumns.length; i++) {
          let primaryKeyColumn = this.primaryKeyColumns[i];
          let indexOfPrimaryKeyColumn =
            otherEntity.primaryKeyColumns.findIndex(
              (otherPrimaryKeyColumn: SqlPrimaryKeyColumnDetail) => {
                return primaryKeyColumn.isEqualTo(
                  otherPrimaryKeyColumn
                );
              }
            );
          if (indexOfPrimaryKeyColumn < 0) {
            allPrimaryKeyColumnsHaveMatch = false;
            break;
          }
        }
        isEqualTo = allPrimaryKeyColumnsHaveMatch;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
