import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ContainsRegexCreator } from "../../../../../../../entity/helper/regex/creator/simple/contains/contains-regex-creator";
import { EndsWithRegexCreator } from "../../../../../../../entity/helper/regex/creator/simple/ends-with/ends-with-regex-creator";
import { EqualsRegexCreator } from "../../../../../../../entity/helper/regex/creator/simple/equals/equals-regex-creator";
import { SimpleRegexCreator } from "../../../../../../../entity/helper/regex/creator/simple/simple-regex-creator";
import { StartsWithRegexCreator } from "../../../../../../../entity/helper/regex/creator/simple/starts-with/starts-with-regex-creator";
import { RegexMatcher } from "../../../../../../../entity/helper/regex/matcher/regex-matcher";
import { DbColumnCategory } from "../../../../../../../entity/model/database/column/category/db-column-category";
import { DbTableCategory } from "../../../../../../../entity/model/database/table/category/db-table-category";
import { BaseComponent } from "../../../../../../base.component";
import { RegexCreatorInputGroupComponent } from "../../../../../../form/input-group/regex/regex-creator-input-group.component";

@Component({
  selector: "db-category-matcher-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegexCreatorInputGroupComponent
  ],
  templateUrl: "./db-category-matcher-editor.component.html",
  styleUrl: "./db-category-matcher-editor.component.scss"
})
export class DbCategoryMatcherEditorComponent<C extends DbTableCategory | DbColumnCategory> extends BaseComponent implements OnInit {

  @Input() categoryMatchers: RegexMatcher<C>[];

  @Input() categoryTypeName: string;

  matcherForEdit: RegexMatcher<C> | undefined;

  simpleRegexCreators: SimpleRegexCreator[];

  selectedRegexCreator: SimpleRegexCreator | undefined;

  allMatchersByCategoryName: Map<string, RegexMatcher<C>>;

  htmlBaseId: string;

  regexCreatorInputGroupBaseHtmlId: string;

  constructor() {
    super();
    this.categoryTypeName = "";
    this.categoryMatchers = [];
    this.simpleRegexCreators = [];

    this.matcherForEdit = undefined;
    this.selectedRegexCreator = undefined;
    this.allMatchersByCategoryName = new Map< string, RegexMatcher<C> >();
    this.htmlBaseId = "";
    this.regexCreatorInputGroupBaseHtmlId = "";

    // Create standard set of Simple Regex Creators
    this.simpleRegexCreators = [
      new EqualsRegexCreator(),
      new StartsWithRegexCreator(),
      new EndsWithRegexCreator(),
      new ContainsRegexCreator()
    ];
  }

  ngOnInit(): void {
    this.htmlBaseId = "databaseCategoryMatcher_" + this.categoryTypeName + "Categories";
    this.regexCreatorInputGroupBaseHtmlId = this.htmlBaseId + "_RegexCreatorInputGroup";

    this.initAllMatchersByCategoryNameMap();
  }

  setMatcherForEdit(matcherSelectChangeEvent: any): void {
    let matcherNameSelected = matcherSelectChangeEvent.target.value;
    if (matcherNameSelected) {
      let matcherSelected = this.allMatchersByCategoryName.get(matcherNameSelected);
      if (matcherSelected) {
        this.matcherForEdit = matcherSelected;
      } else {
        console.error( "Unable to find the " + this.categoryTypeName + " Category Matcher with name [" + matcherNameSelected + "]" );
      }
    }
  }

  setRegexCreatorForEdit(regexCreatorSelected: SimpleRegexCreator): void {
    if (regexCreatorSelected) {
      this.selectedRegexCreator = regexCreatorSelected;
    }
  }

  addNameRegexToMatcher(nameRegexToAdd: string): void {
    if (
      this.matcherForEdit
      && nameRegexToAdd !== null
      && nameRegexToAdd !== undefined
    ) {
      this.matcherForEdit.addNameRegex(nameRegexToAdd);
    }
  }

  doesMatcherHaveAnyRegexes( matcherToCheck: RegexMatcher<C> ): boolean {
    let doesMatcherHaveAnyRegexes = false;
    if (
      matcherToCheck
      && matcherToCheck.matchingRegexes
      && matcherToCheck.matchingRegexes.length > 0
    ) {
      doesMatcherHaveAnyRegexes = true;
    }
    return doesMatcherHaveAnyRegexes;
  }

  private initAllMatchersByCategoryNameMap(): void {
    // Create a mapping of the Category being matched to the Regex Matcher for that Category
    this.categoryMatchers.forEach((databaseCategoryMatcher: RegexMatcher<C>) => {
      let categoryForMatch = databaseCategoryMatcher.objectForMatch;
      if (categoryForMatch) {
        let categoryForMatchName = categoryForMatch.name;
        let existingCategoryMatcher = this.allMatchersByCategoryName.get(categoryForMatchName);
        if(!existingCategoryMatcher) {
          this.allMatchersByCategoryName.set(
            categoryForMatchName,
            databaseCategoryMatcher
          );
        } else {
          console.warn( "Was provided a Regex Matcher for " + this.categoryTypeName + " Categories, but it already existed; ignoring" );
        }
      } else {
        console.warn( "Was provided a Regex Matcher for a " + this.categoryTypeName + " Category, but the Category was null/undefined; ignoring" );
      }
    });
  }
}
