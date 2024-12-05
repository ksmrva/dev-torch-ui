import { ApiEntity } from "../../../../../api-entity";

export class CodeModelSourceFileData extends ApiEntity {

  fileId: number;

  isBinary: boolean;

  binaryContentUri: string;

  textContent: string

  constructor() {
    super();

    this.fileId = -1;
    this.isBinary = false;
    this.binaryContentUri = "";
    this.textContent = "";
  }

  override deserialize(json: any): CodeModelSourceFileData {
    super.deserialize(json);
    if (json) {
      this.fileId = json.fileId;
      this.isBinary = json.isBinary;
      this.binaryContentUri = json.binaryContentUri;
      this.textContent = json.textContent;
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeModelSourceFileData): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(
        this.fileId === otherEntity.fileId
        && this.isBinary === otherEntity.isBinary
        && this.binaryContentUri === otherEntity.binaryContentUri
        && this.textContent === otherEntity.textContent
      ) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

}
