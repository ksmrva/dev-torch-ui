import { ApiEntity } from "../../../../api-entity";

export class CodeFileType extends ApiEntity {

  name: string;

  constructor() {
    super();

    this.name = "";
  }

  override deserialize(json: any): CodeFileType {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeFileType): boolean {
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
