import { CodeFile } from "../../code-file";
import { CodeFileNode } from "../../node/code-file-node";
import { CodeFileType } from "../code-file-type";

export const CODE_FILE_TYPE_DIRECTORY: string = "directory";

export class CodeDirectoryFile  extends CodeFile {

  "@type": string = CODE_FILE_TYPE_DIRECTORY;

  constructor() {
    super();
  }

  initialize(fileNodeInit: CodeFileNode, fileTypeInit: CodeFileType, nameInit: string): CodeDirectoryFile {
    super.initializeBaseValues( fileNodeInit, fileTypeInit, nameInit);

    return this;
  }

  getTypeName(): string {
    return CODE_FILE_TYPE_DIRECTORY;
  }

  override deserialize(json: any): CodeDirectoryFile {
    super.deserialize(json);
    if (json) {
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeDirectoryFile): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
    }
    return isEqualTo;
  }

}
