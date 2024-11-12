import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegexMatcher } from "../../../../../../../../entity/helper/regex/matcher/regex-matcher";
import { DbTableCategory } from "../../../../../../../../entity/model/database/table/category/db-table-category";
import { DbModelService } from "../../../../../../../../service/model/database/db-model.service";
import { DbCategoryMatcherEditorComponent } from "../../../../../category/matcher/edit/editor/db-category-matcher-editor.component";
import { BaseComponent } from "../../../../../../../base.component";

@Component({
  selector: "db-table-category-matcher-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DbCategoryMatcherEditorComponent
],
  templateUrl: "./db-table-category-matcher-editor.component.html",
  styleUrl: "./db-table-category-matcher-editor.component.scss"
})
export class DbTableCategoryMatcherEditorComponent extends BaseComponent implements OnInit {

  @Input() tableCategoryMatchers: RegexMatcher<DbTableCategory>[];

  categoryTypeName: string;

  constructor(
    private dbModelService: DbModelService
  ) {
    super();
    this.tableCategoryMatchers = [];

    this.categoryTypeName = "";
  }

  ngOnInit(): void {
    this.categoryTypeName = "Table";

    let availableTableCategoriesSubscription = this.dbModelService.getTableCategories().subscribe({
                                                                                                next: (tableCategories: DbTableCategory[] | undefined) => {
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

  private createCategoryMatchers(availableTableCategories: DbTableCategory[]): void {
    // Reset the Regex Matchers and then add a new Regex Matcher for each of the available Table Categories
    this.tableCategoryMatchers = [];
    availableTableCategories.forEach((availableTableCategory: DbTableCategory) => {
      let tableCategoryMatcher = new RegexMatcher<DbTableCategory>();
      tableCategoryMatcher.objectForMatch = availableTableCategory;

      this.tableCategoryMatchers.push(tableCategoryMatcher);
    });
  }

}
