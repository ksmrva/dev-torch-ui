import { ApiEntity } from "../../../../../shared/api-entity";

export class DbModelSourceUrlSupportedProvider extends ApiEntity {

  provider: string;

  constructor() {
    super();

    this.provider = "";
  }

  override deserialize(json: any): DbModelSourceUrlSupportedProvider {
    super.deserialize(json);
    if (json) {
      this.provider = json.provider;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbModelSourceUrlSupportedProvider): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.provider === otherEntity.provider) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
