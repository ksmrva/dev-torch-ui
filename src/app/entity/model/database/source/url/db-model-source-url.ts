import { ApiEntity } from "../../../../api-entity";

export class DbModelSourceUrl extends ApiEntity {

  scheme: string;

  provider: string;

  hostname: string;

  port: string;

  maintenanceDatabaseName: string;

  constructor() {
    super();

    this.scheme = "";
    this.provider = "";
    this.hostname = "";
    this.port = "";
    this.maintenanceDatabaseName = "";
  }

  override toString(): string {
    return this.scheme + ":" + this.provider + "://" + this.hostname + ":" + this.port + "/" + this.maintenanceDatabaseName;
  }

  override deserialize(json: any): DbModelSourceUrl {
    super.deserialize(json);
    if (json) {
      this.scheme = json.scheme;
      this.provider = json.provider;
      this.hostname = json.hostname;
      this.port = json.port;
      this.maintenanceDatabaseName = json.maintenanceDatabaseName;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbModelSourceUrl): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (
      isEqualTo
      && this.scheme === otherEntity.scheme
      && this.provider === otherEntity.provider
      && this.hostname === otherEntity.hostname
      && this.port === otherEntity.port
      && this.maintenanceDatabaseName === otherEntity.maintenanceDatabaseName
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

}
