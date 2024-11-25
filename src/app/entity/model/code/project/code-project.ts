import { ApiEntity } from "../../../api-entity";
import { CodeFileNode } from "../file/node/code-file-node";

export class CodeProject extends ApiEntity {

  name: string;

  rootFileNode: CodeFileNode;

  constructor() {
    super();

    this.name = "";
    this.rootFileNode = new CodeFileNode();
  }

  override deserialize(json: any): CodeProject {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.rootFileNode = new CodeFileNode().deserialize(json.rootFileNode);

    }
    return this;
  }

  override isEqualTo(otherEntity: CodeProject): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.rootFileNode.isEqualTo(otherEntity.rootFileNode)
      ) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
