import { ApiEntity } from "../../../../api-entity";

export class CodeFileNode extends ApiEntity {

  name: string;

  fileId: number;

  hasChildren: boolean;

  constructor() {
    super();

    this.name = "";
    this.fileId = -1;
    this.hasChildren = false;
  }

  override deserialize(json: any): CodeFileNode {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.fileId = json.fileId;
      this.hasChildren = json.hasChildren;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeFileNode): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.fileId === otherEntity.fileId
        && this.hasChildren === otherEntity.hasChildren) {
          isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
