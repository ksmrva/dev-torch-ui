import { ApiEntity } from "../../../../../api-entity";

export class DbModelSourceSupportedDriver extends ApiEntity {

  name: string;

  constructor() {
    super();

    this.name = "";
  }

  override deserialize(json: any): DbModelSourceSupportedDriver {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbModelSourceSupportedDriver): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
