import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegexMatcher } from "../../../../../../../../../entity/misc/regex/matcher/regex-matcher";
import { DbColumnCategory } from "../../../../../../../../../entity/model/database/component/column/category/db-column-category";
import { DbModelComponentService } from "../../../../../../../../../service/model/database/component/db-model-component.service";
import { BaseComponent } from "../../../../../../../../base.component";
import { DbCategoryMatcherEditorComponent } from "../../../../../category/matcher/edit/editor/db-category-matcher-editor.component";

@Component({
  selector: "db-column-category-matcher-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DbCategoryMatcherEditorComponent
  ],
  templateUrl: "./db-column-category-matcher-editor.component.html",
  styleUrl: "./db-column-category-matcher-editor.component.scss"
})
export class DbColumnCategoryMatcherEditorComponent extends BaseComponent implements OnInit {

  @Input() columnCategoryMatchers: RegexMatcher<DbColumnCategory>[];

  categoryTypeName: string;

  constructor(
    private dbModelService: DbModelComponentService
  ) {
    super();
    this.columnCategoryMatchers = [];

    this.categoryTypeName = "";
  }

  ngOnInit(): void {
    this.categoryTypeName = "Column";

    let availableColumnCategoriesSubscription = this.dbModelService.getColumnCategories().subscribe({
                                                                                                  next: (columnCategories: DbColumnCategory[] | undefined) => {
                                                                                                    if (!columnCategories) {
                                                                                                      throw new Error("Failed to initialize the Column Categories");
                                                                                                    }
                                                                                                    this.createCategoryMatchers(columnCategories);
                                                                                                  },
                                                                                                  error: (err: any) => {
                                                                                                    throw new Error( "Failed to initialize the Column Categories due to [" + err + "]" );
                                                                                                  },
                                                                                                  complete: () => {
                                                                                                    console.log("Finished initializing Column Categories");
                                                                                                  }
                                                                                                });
    this.addLongLivingSubscription(availableColumnCategoriesSubscription);
  }

  private createCategoryMatchers(availableColumnCategories: DbColumnCategory[]): void {
    // Reset the Regex Matchers and then add a new Regex Matcher for each of the available Column Categories
    this.columnCategoryMatchers = [];
    availableColumnCategories.forEach((availableColumnCategory: DbColumnCategory) => {
      let columnCategoryMatcher = new RegexMatcher<DbColumnCategory>();
      columnCategoryMatcher.objectForMatch = availableColumnCategory;

      this.columnCategoryMatchers.push(columnCategoryMatcher);
    });
  }
}
