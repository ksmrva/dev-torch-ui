import { ApiEntity } from "../../../api-entity";
import { CodeFileNode } from "./node/code-file-node";
import { CodeFileType } from "./type/code-file-type";

export abstract class CodeFile extends ApiEntity {

  fileNode: CodeFileNode;

  fileType: CodeFileType;

  name: string;

  constructor() {
    super();

    this.fileNode = new CodeFileNode();
    this.fileType = new CodeFileType();
    this.name = "";
  }

  initializeBaseValues(fileNodeInit: CodeFileNode, fileTypeInit: CodeFileType, nameInit: string): CodeFile {
    this.fileNode = fileNodeInit;
    this.fileType = fileTypeInit;
    this.name = nameInit;

    return this;
  }

  abstract getTypeName(): string;

  isTypeEqual(typeName: string): boolean {
    return this.getTypeName() === typeName;
  }

  override deserialize(json: any): CodeFile {
    super.deserialize(json);
    if (json) {
      this.fileNode = new CodeFileNode().deserialize(json.fileNode);
      this.fileType = new CodeFileType().deserialize(json.fileType);
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeFile): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.fileNode.isEqualTo(otherEntity.fileNode)
        && this.fileType.isEqualTo(otherEntity.fileType)
        && this.name === otherEntity.name
      ) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
