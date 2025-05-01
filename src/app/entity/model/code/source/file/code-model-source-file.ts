import { ApiEntity } from "../../../../shared/api-entity";
import { CodeModelSourceFileData } from './data/code-model-source-file-data';
import { CodeModelSourceFileTreeNode } from "./tree/node/code-model-source-file-tree-node";

export class CodeModelSourceFile extends ApiEntity {

  name: string;

  isDirectory: boolean;

  data: CodeModelSourceFileData | undefined;

  children: CodeModelSourceFile[];

  treeNode: CodeModelSourceFileTreeNode;

  constructor() {
    super();

    this.name = "";
    this.isDirectory = false;
    this.data = undefined;
    this.children = [];
    this.treeNode = new CodeModelSourceFileTreeNode();
  }

  override deserialize(json: any): CodeModelSourceFile {
    super.deserialize(json);
    if (json) {
      this.treeNode = new CodeModelSourceFileTreeNode().deserialize(json.fileId);
      this.name = json.name;
      this.isDirectory = json.isDirectory;
      this.data = new CodeModelSourceFileData().deserialize(json.data);

      this.children = [];
      let jsonForChildren: any[] = json.children;
      if (jsonForChildren) {
        jsonForChildren.forEach((jsonForChild: any) => {
          let child = new CodeModelSourceFile().deserialize(jsonForChild);
          if (child) {
            this.children.push(child);
          } else {
            console.log("Tried to convert JSON for Child Code Model Source File [" + jsonForChild + "] into an Object but received a null");
          }
        });
      }
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeModelSourceFile): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(
        this.treeNode.isEqualTo(otherEntity.treeNode)
        && this.name === otherEntity.name
        && this.isDirectory === otherEntity.isDirectory
        && this.children.length === otherEntity.children.length) {

        if(this.data && otherEntity.data) {
          isEqualTo = this.data.isEqualTo(otherEntity.data);

        } else if(!this.data) {
          if(otherEntity.data) {
            isEqualTo = false;
          } else {
            isEqualTo = true;
          }

        } else {
          if(this.data) {
            isEqualTo = false;
          } else {
            isEqualTo = true;
          }
        }

        let allChildrenHaveMatch = true;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          let indexOfChild = otherEntity.children.findIndex((otherChild: CodeModelSourceFile) => {
            return child.isEqualTo(otherChild);
          });
          if (indexOfChild < 0) {
            allChildrenHaveMatch = false;
            break;
          }
        }
        isEqualTo = allChildrenHaveMatch;

      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
