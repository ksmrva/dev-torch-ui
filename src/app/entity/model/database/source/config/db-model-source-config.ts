import { ApiEntity } from "../../../../api-entity";
import { DbModelSourceUrl } from "../url/db-model-source-url";

export class DbModelSourceConfig extends ApiEntity {

  url: DbModelSourceUrl;

  driverName: string;

  username: string;

  password: string;

  constructor() {
    super();

    this.url = new DbModelSourceUrl();
    this.driverName = "";
    this.username = "";
    this.password = "";
  }

  override toString(): string {
    return "URL ID: " + this.url.id + "; Driver Name; " + this.driverName + "; Credentials: " + this.username + "@" + this.password;
  }

  override deserialize(json: any): DbModelSourceConfig {
    super.deserialize(json);
    if (json) {
      this.url = new DbModelSourceUrl().deserialize(json.url);
      this.driverName = json.driverName;
      this.username = json.username;
      this.password = json.password;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbModelSourceConfig): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (
      isEqualTo
      && this.url.isEqualTo(otherEntity.url)
      && this.driverName === otherEntity.driverName
      && this.username === otherEntity.username
      && this.password === otherEntity.password
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

}
