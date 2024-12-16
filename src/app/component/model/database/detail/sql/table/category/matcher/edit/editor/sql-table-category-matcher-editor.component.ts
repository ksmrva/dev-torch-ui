import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegexMatcher } from "../../../../../../../../../../entity/misc/regex/matcher/regex-matcher";
import { DbCollectionCategory } from "../../../../../../../../../../entity/model/database/detail/category/collection/db-collection-category";
import { DatabaseModelDetailService } from "../../../../../../../../../../service/model/database/detail/db-model-detail.service";
import { BaseComponent } from "../../../../../../../../../base.component";
import { DbCategoryMatcherEditorComponent } from "../../../../../../category/matcher/edit/editor/db-category-matcher-editor.component";

@Component({
  selector: "sql-table-category-matcher-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DbCategoryMatcherEditorComponent
],
  templateUrl: "./sql-table-category-matcher-editor.component.html",
  styleUrl: "./sql-table-category-matcher-editor.component.scss"
})
export class SqlTableCategoryMatcherEditorComponent extends BaseComponent implements OnInit {

  @Input() tableCategoryMatchers: RegexMatcher<DbCollectionCategory>[];

  categoryTypeName: string;

  constructor(
    private databaseModelDetailService: DatabaseModelDetailService
  ) {
    super();
    this.tableCategoryMatchers = [];

    this.categoryTypeName = "";
  }

  ngOnInit(): void {
    this.categoryTypeName = "Table";

    let availableTableCategoriesSubscription = this.databaseModelDetailService.getCollectionCategories().subscribe({
                                                                                                              next: (tableCategories: DbCollectionCategory[] | undefined) => {
                                                                                                                if (!tableCategories) {
                                                                                                                  throw new Error("Failed to initialize the Table Categories");
                                                                                                                }
                                                                                                                this.createCategoryMatchers(tableCategories);
                                                                                                              },
                                                                                                              error: (err: any) => {
                                                                                                                throw new Error( "Failed to initialize the Table Categories due to [" + err + "]" );
                                                                                                              },
                                                                                                              complete: () => {
                                                                                                                console.log("Finished initializing Table Categories");
                                                                                                              }
                                                                                                            });
    this.addLongLivingSubscription(availableTableCategoriesSubscription);
  }

  private createCategoryMatchers(availableTableCategories: DbCollectionCategory[]): void {
    // Reset the Regex Matchers and then add a new Regex Matcher for each of the available Table Categories
    this.tableCategoryMatchers = [];
    availableTableCategories.forEach((availableTableCategory: DbCollectionCategory) => {
      let tableCategoryMatcher = new RegexMatcher<DbCollectionCategory>();
      tableCategoryMatcher.objectForMatch = availableTableCategory;

      this.tableCategoryMatchers.push(tableCategoryMatcher);
    });
  }

}
