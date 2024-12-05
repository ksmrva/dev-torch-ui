import { ApiEntity } from "../../../../api-entity";
import { CodeModelSourceFileTreeNode } from "../file/tree/node/code-model-source-file-tree-node";

export class CodeModelSourceProject extends ApiEntity {

  name: string;

  rootTreeNode: CodeModelSourceFileTreeNode;

  constructor() {
    super();

    this.name = "";
    this.rootTreeNode = new CodeModelSourceFileTreeNode();
  }

  override deserialize(json: any): CodeModelSourceProject {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.rootTreeNode = new CodeModelSourceFileTreeNode().deserialize(json.rootTreeNode);
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeModelSourceProject): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.rootTreeNode.isEqualTo(otherEntity.rootTreeNode)
      ) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
