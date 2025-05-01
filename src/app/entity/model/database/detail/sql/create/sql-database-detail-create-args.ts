import { RegexMatcher } from "../../../../../shared/regex/matcher/regex-matcher";
import { DbFieldCategory } from "../../category/field/db-field-category";
import { SqlDatabaseDetailPath } from "../path/sql-database-path";
import { DbCollectionCategory } from "../../category/collection/db-collection-category";

export class SqlDatabaseDetailCreateArgs {

  path: SqlDatabaseDetailPath;

  sourceConfigId: number;

  tableCategoryMatchers: RegexMatcher<DbCollectionCategory>[];

  columnCategoryMatchers: RegexMatcher<DbFieldCategory>[];

  constructor() {
    this.path = new SqlDatabaseDetailPath();
    this.sourceConfigId = -1;
    this.tableCategoryMatchers = [];
    this.columnCategoryMatchers = [];
  }

}

