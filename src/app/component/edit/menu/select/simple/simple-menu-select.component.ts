import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StringUtil } from "../../../../../entity/misc/string/util/string-util";
import { BaseComponent } from "../../../../base.component";

@Component({
  selector: "simple-menu-select",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: "./simple-menu-select.component.html",
  styleUrl: "./simple-menu-select.component.scss"
})
export class SimpleMenuSelectComponent extends BaseComponent {

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
