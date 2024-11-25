import { ApiEntity } from "../../../../../api-entity";

export class DbModelSourceUrlSupportedScheme extends ApiEntity {

  scheme: string;

  constructor() {
    super();

    this.scheme = "";
  }

  override deserialize(json: any): DbModelSourceUrlSupportedScheme {
    super.deserialize(json);
    if (json) {
      this.scheme = json.scheme;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbModelSourceUrlSupportedScheme): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.scheme === otherEntity.scheme) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
