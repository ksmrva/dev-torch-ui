import { CodeFile } from "../code-file";
import { CODE_FILE_TYPE_DATA, CodeDataFile } from "../type/data/code-data-file";
import { CODE_FILE_TYPE_DIRECTORY, CodeDirectoryFile } from "../type/directory/code-directory-file";
import { CODE_FILE_TYPE_TEXT, CodeTextFile } from "../type/text/code-text-file";

export class CodeFileFactory {

  static createCodeFile(codeFileJson: any): CodeFile | undefined {
    let file = undefined;
    if(codeFileJson && codeFileJson.fileType) {
      let fileTypeName = codeFileJson.fileType.name;
      if(CodeFileFactory.isDataType(fileTypeName)) {
        file = new CodeDataFile().deserialize(codeFileJson);

      } else if(CodeFileFactory.isTextType(fileTypeName)) {
        file = new CodeTextFile().deserialize(codeFileJson);

      } else if(CodeFileFactory.isDirectoryType(fileTypeName)) {
        file = new CodeDirectoryFile().deserialize(codeFileJson);

      } else {
        throw new Error("Unexpected Data Type [" + fileTypeName + "]");
      }
    }
    return file;
  }

  static isDataType(fileType: string): boolean {
    return CodeFileFactory.doesFileTypeMatch(fileType, CODE_FILE_TYPE_DATA);
  }

  static isTextType(fileType: string): boolean {
    return CodeFileFactory.doesFileTypeMatch(fileType, CODE_FILE_TYPE_TEXT);
  }

  static isDirectoryType(fileType: string): boolean {
    return CodeFileFactory.doesFileTypeMatch(fileType, CODE_FILE_TYPE_DIRECTORY);
  }

  private static doesFileTypeMatch(fileTypeA: string, fileTypeB: string): boolean {
    return fileTypeA === fileTypeB;
  }

}
