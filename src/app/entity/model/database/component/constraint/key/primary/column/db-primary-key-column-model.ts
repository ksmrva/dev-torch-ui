import { ApiEntity } from "../../../../../../../api-entity";

export class DbPrimaryKeyColumnModel extends ApiEntity {

  columnId: number;

  constructor() {
    super();

    this.columnId = -1
  }

  override deserialize(json: any): DbPrimaryKeyColumnModel {
    super.deserialize(json);
    if (json) {
      this.columnId = json.columnModel.id;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbPrimaryKeyColumnModel): boolean {
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
