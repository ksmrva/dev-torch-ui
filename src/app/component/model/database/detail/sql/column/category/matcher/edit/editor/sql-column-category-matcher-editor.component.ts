import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegexMatcher } from "../../../../../../../../../../entity/shared/regex/matcher/regex-matcher";
import { DbFieldCategory } from "../../../../../../../../../../entity/model/database/detail/category/field/db-field-category";
import { DatabaseModelDetailService } from "../../../../../../../../../../service/model/database/detail/db-model-detail.service";
import { BaseComponent } from "../../../../../../../../../shared/base/base.component";
import { DbCategoryMatcherEditorComponent } from "../../../../../../category/matcher/edit/editor/db-category-matcher-editor.component";

@Component({
  selector: "sql-column-category-matcher-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DbCategoryMatcherEditorComponent
  ],
  templateUrl: "./sql-column-category-matcher-editor.component.html",
  styleUrl: "./sql-column-category-matcher-editor.component.scss"
})
export class SqlColumnCategoryMatcherEditorComponent extends BaseComponent implements OnInit {

  @Input() columnCategoryMatchers: RegexMatcher<DbFieldCategory>[];

  categoryTypeName: string;

  constructor(
    private databaseModelDetailService: DatabaseModelDetailService
  ) {
    super();
    this.columnCategoryMatchers = [];

    this.categoryTypeName = "";
  }

  ngOnInit(): void {
    this.categoryTypeName = "Column";

    let availableColumnCategoriesSubscription = this.databaseModelDetailService.getFieldCategories().subscribe({
                                                                                                          next: (columnCategories: DbFieldCategory[] | undefined) => {
                                                                                                            if (!columnCategories) {
                                                                                                              throw new Error("Failed to initialize the SQL Column Categories");
                                                                                                            }
                                                                                                            this.createCategoryMatchers(columnCategories);
                                                                                                          },
                                                                                                          error: (err: any) => {
                                                                                                            throw new Error( "Failed to initialize the SQL Column Categories due to [" + err + "]" );
                                                                                                          },
                                                                                                          complete: () => {
                                                                                                            console.log("Finished initializing SQL Column Categories");
                                                                                                          }
                                                                                                        });
    this.addLongLivingSubscription(availableColumnCategoriesSubscription);
  }

  private createCategoryMatchers(availableColumnCategories: DbFieldCategory[]): void {
    // Reset the Regex Matchers and then add a new Regex Matcher for each of the available Column Categories
    this.columnCategoryMatchers = [];
    availableColumnCategories.forEach((availableColumnCategory: DbFieldCategory) => {
      let columnCategoryMatcher = new RegexMatcher<DbFieldCategory>();
      columnCategoryMatcher.objectForMatch = availableColumnCategory;

      this.columnCategoryMatchers.push(columnCategoryMatcher);
    });
  }

}
