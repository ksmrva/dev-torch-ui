import { ApiEntity } from "../../../../shared/api-entity";

export class DbModelSourcePreset extends ApiEntity {

  name: string;

  scheme: string;

  provider: string;

  driverName: string;

  constructor() {
    super();

    this.name = "";
    this.scheme = "";
    this.provider = "";
    this.driverName = "";
  }

  override deserialize(json: any): DbModelSourcePreset {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.scheme = json.scheme;
      this.provider = json.provider;
      this.driverName = json.driverName;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbModelSourcePreset): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.scheme === otherEntity.scheme
        && this.provider === otherEntity.provider
        && this.driverName === otherEntity.driverName) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
