import { ApiEntity } from "../../../../api-entity";

const UNDEFINED_TABLE_CATEGORY_VALUE: string = "Undefined";

export class DbTableCategory extends ApiEntity {

  name: string;

  constructor() {
    super();

    this.name = "";
  }

  override deserialize(json: any): DbTableCategory {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbTableCategory): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo && this.name === otherEntity.name) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

  static isNameEqualToUndefinedCategory( tableCategoryNameToCheck: string ): boolean {
    let isNameEqualToUndefinedCategory = false;
    if (tableCategoryNameToCheck) {
      isNameEqualToUndefinedCategory =
        tableCategoryNameToCheck === UNDEFINED_TABLE_CATEGORY_VALUE;
    }
    return isNameEqualToUndefinedCategory;
  }

}
