import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BaseComponent } from "../../../../base.component";
import { SimpleRegexCreator } from "../../../../../entity/misc/regex/creator/simple/simple-regex-creator";

@Component({
  selector: "regex-creator-input-group",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./regex-creator-input-group.component.html",
  styleUrl: "./regex-creator-input-group.component.scss"
})
export class RegexCreatorInputGroupComponent extends BaseComponent {

  @Input() htmlBaseId: string;

  @Input() simpleRegexCreators: SimpleRegexCreator[];

  @Output() addRegexEventEmitter: EventEmitter<string>;

  selectedRegexCreator: SimpleRegexCreator | undefined;

  wordToMatch: string | undefined;

  constructor() {
    super();
    this.selectedRegexCreator = undefined;
    this.addRegexEventEmitter = new EventEmitter<string>();

    this.htmlBaseId = "";
    this.simpleRegexCreators = [];
    this.wordToMatch = undefined;
  }

  setRegexCreatorForEdit(regexCreatorSelected: SimpleRegexCreator): void {
    if (regexCreatorSelected) {
      this.selectedRegexCreator = regexCreatorSelected;
    }
  }

  addNameRegexToMatcher(): void {
    if (
      this.selectedRegexCreator &&
      this.wordToMatch !== null &&
      this.wordToMatch !== undefined
    ) {
      let regexForWord = this.selectedRegexCreator.createRegex(
        this.wordToMatch
      );

      this.selectedRegexCreator = undefined;
      this.wordToMatch = undefined;
      this.addRegexEventEmitter.emit(regexForWord);
    }
  }
}
