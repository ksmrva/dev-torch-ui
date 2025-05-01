import { ApiEntity } from "../../../../../../../../shared/api-entity";

export class SqlPrimaryKeyColumnDetail extends ApiEntity {

  columnId: number;

  constructor() {
    super();

    this.columnId = -1
  }

  override deserialize(json: any): SqlPrimaryKeyColumnDetail {
    super.deserialize(json);
    if (json) {
      this.columnId = json.columnModel.id;
    }
    return this;
  }

  override isEqualTo(otherEntity: SqlPrimaryKeyColumnDetail): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.columnId === otherEntity.columnId) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
