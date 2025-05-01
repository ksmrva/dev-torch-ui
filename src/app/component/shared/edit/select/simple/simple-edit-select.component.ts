import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StringUtil } from "../../../../../entity/shared/string/util/string-util";
import { BaseComponent } from "../../../base/base.component";

@Component({
  selector: "simple-edit-select",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: "./simple-edit-select.component.html",
  styleUrl: "./simple-edit-select.component.scss"
})
export class SimpleEditSelectComponent extends BaseComponent {

  @Input() baseHtmlId: string;

  @Input() labelName: string;

  @Input() availableKeys: string[] | undefined;

  @Output() keyWasSelected: EventEmitter<string>;

  selectedKey: string | undefined;

  constructor() {
    super();
    this.baseHtmlId = "";
    this.labelName = "";

    this.availableKeys = [];
    this.selectedKey = undefined;
    this.keyWasSelected = new EventEmitter<string>();
  }

  selectKey(): void {
    if(
      StringUtil.isNotEmpty(this.selectedKey)) {
      this.keyWasSelected.emit(this.selectedKey);
    }
    this.resetSelect();
  }

  resetSelect(): void {
    this.selectedKey = undefined;
  }

}
