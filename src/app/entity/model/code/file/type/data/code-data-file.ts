import { CodeFile } from "../../code-file";
import { CodeFileNode } from "../../node/code-file-node";
import { CodeFileType } from "../code-file-type";

export const CODE_FILE_TYPE_DATA: string = "data";

export class CodeDataFile extends CodeFile {

  "@type": string = CODE_FILE_TYPE_DATA;

  contents: Uint8Array;

  constructor() {
    super();

    this.contents = new Uint8Array();
  }

  initialize(fileNodeInit: CodeFileNode, fileTypeInit: CodeFileType, nameInit: string, contentsInit: Uint8Array): CodeDataFile {
    super.initializeBaseValues( fileNodeInit, fileTypeInit, nameInit);
    this.contents = contentsInit;

    return this;
  }

  getTypeName(): string {
    return CODE_FILE_TYPE_DATA;
  }

  override deserialize(json: any): CodeDataFile {
    super.deserialize(json);
    if (json) {
      this.contents = json.contents;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeDataFile): boolean {
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
