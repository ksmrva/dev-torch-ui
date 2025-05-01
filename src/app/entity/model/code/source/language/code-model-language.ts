import { ApiEntity } from "../../../../shared/api-entity";

export class CodeModelLanguage extends ApiEntity {

  name: string;

  constructor() {
    super();

    this.name = "";
  }

  override deserialize(json: any): CodeModelLanguage {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeModelLanguage): boolean {
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
