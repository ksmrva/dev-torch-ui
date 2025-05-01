import { ApiEntity } from "../../../../../shared/api-entity";

const UNDEFINED_TABLE_CATEGORY_VALUE: string = "Undefined";

export class DbCollectionCategory extends ApiEntity {

  name: string;

  constructor() {
    super();

    this.name = "";
  }

  override deserialize(json: any): DbCollectionCategory {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
    }
    return this;
  }

  override isEqualTo(otherEntity: DbCollectionCategory): boolean {
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

  static isNameEqualToUndefinedCategory( tableCategoryNameToCheck: string ): boolean {
    let isNameEqualToUndefinedCategory = false;
    if (tableCategoryNameToCheck) {
      isNameEqualToUndefinedCategory =
        tableCategoryNameToCheck === UNDEFINED_TABLE_CATEGORY_VALUE;
    }
    return isNameEqualToUndefinedCategory;
  }

}
