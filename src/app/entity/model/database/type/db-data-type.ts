import { ApiEntity } from "../../../api-entity";

const UNDEFINED_DATA_TYPE_VALUE: string = "OTHER";

export class DbDataType extends ApiEntity {

  name: string;

  constructor() {
    super();

    this.name = "";
  }

  override deserialize(json: any): DbDataType {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbDataType): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo && this.name === otherEntity.name) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

  static isNameEqualToUndefinedType(dataTypeNameToCheck: string): boolean {
    let isNameEqualToUndefinedType = false;
    if (dataTypeNameToCheck) {
      isNameEqualToUndefinedType =
        dataTypeNameToCheck === UNDEFINED_DATA_TYPE_VALUE;
    }
    return isNameEqualToUndefinedType;
  }

}
