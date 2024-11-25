import { CodeFile } from "../../code-file";
import { CodeFileNode } from "../../node/code-file-node";
import { CodeFileType } from "../code-file-type";

export const CODE_FILE_TYPE_TEXT: string = "text"

export class CodeTextFile extends CodeFile {

  "@type": string = CODE_FILE_TYPE_TEXT;

  contents: string;

  constructor() {
    super();

    this.contents = "";
  }

  initialize(fileNodeInit: CodeFileNode, fileTypeInit: CodeFileType, nameInit: string, contentsInit: string): CodeTextFile {
    super.initializeBaseValues( fileNodeInit, fileTypeInit, nameInit);
    this.contents = contentsInit;

    return this;
  }

  getTypeName(): string {
    return CODE_FILE_TYPE_TEXT;
  }

  override deserialize(json: any): CodeTextFile {
    super.deserialize(json);
    if (json) {
      this.contents = json.contents;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeTextFile): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.contents === otherEntity.contents) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
