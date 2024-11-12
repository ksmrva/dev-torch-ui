import { ApiEntity } from "../../../../../api-entity";

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
    if (
      isEqualTo
      && this.provider === otherEntity.provider
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }
  
}