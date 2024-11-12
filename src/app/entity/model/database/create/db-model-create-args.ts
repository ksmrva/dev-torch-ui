import { RegexMatcher } from "../../../helper/regex/matcher/regex-matcher";
import { DbColumnCategory } from "../column/category/db-column-category";
import { DbModelName } from "../name/db-model-name";
import { DbTableCategory } from "../table/category/db-table-category";

export class DbModelCreateArgs {

  name: DbModelName;

  sourceConfigId: number;

  tableCategoryMatchers: RegexMatcher<DbTableCategory>[];

  columnCategoryMatchers: RegexMatcher<DbColumnCategory>[];

  constructor() {
    this.name = new DbModelName();
    this.sourceConfigId = -1;
    this.tableCategoryMatchers = [];
    this.columnCategoryMatchers = [];
  }

}

