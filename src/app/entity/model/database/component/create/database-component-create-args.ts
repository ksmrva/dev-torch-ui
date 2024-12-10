import { RegexMatcher } from "../../../../misc/regex/matcher/regex-matcher";
import { DbColumnCategory } from "../column/category/db-column-category";
import { DatabasePath } from "../path/database-path";
import { DbTableCategory } from "../table/category/db-table-category";

export class DatabaseComponentCreateArgs {

  path: DatabasePath;

  sourceConfigId: number;

  tableCategoryMatchers: RegexMatcher<DbTableCategory>[];

  columnCategoryMatchers: RegexMatcher<DbColumnCategory>[];

  constructor() {
    this.path = new DatabasePath();
    this.sourceConfigId = -1;
    this.tableCategoryMatchers = [];
    this.columnCategoryMatchers = [];
  }

}

