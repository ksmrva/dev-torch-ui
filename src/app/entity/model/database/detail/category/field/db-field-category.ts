import { ApiEntity } from "../../../../../shared/api-entity";

const UNDEFINED_COLUMN_CATEGORY_VALUE: string = "Undefined";

export class DbFieldCategory extends ApiEntity {

  name: string;

  constructor() {
    super();

    this.name = "";
  }

  override deserialize(json: any): DbFieldCategory {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbFieldCategory): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

  static isNameEqualToUndefinedCategory( columnCategoryNameToCheck: string ): boolean {
    let isNameEqualToUndefinedCategory = false;
    if (columnCategoryNameToCheck) {
      isNameEqualToUndefinedCategory = columnCategoryNameToCheck === UNDEFINED_COLUMN_CATEGORY_VALUE;
    }
    return isNameEqualToUndefinedCategory;
  }

}
