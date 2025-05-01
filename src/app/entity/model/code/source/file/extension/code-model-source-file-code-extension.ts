import { ApiEntity } from "../../../../../shared/api-entity";
import { CodeModelLanguage } from "../../language/code-model-language";

export class CodeModelSourceFileCodeExtension extends ApiEntity {

  extension: string;

  language: CodeModelLanguage;

  constructor() {
    super();

    this.extension = "";
    this.language = new CodeModelLanguage();
  }

  override deserialize(json: any): CodeModelSourceFileCodeExtension {
    super.deserialize(json);
    if (json) {
      this.extension = json.extension;
      this.language = new CodeModelLanguage().deserialize(json.language);
    }
    return this;
  }

  override isEqualTo(otherEntity: CodeModelSourceFileCodeExtension): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(
        this.extension === otherEntity.extension
        && this.language.isEqualTo(otherEntity.language)) {
          isEqualTo = true;
        } else {
          isEqualTo = false;
        }
    }
    return isEqualTo;
  }

}
