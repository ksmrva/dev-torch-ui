import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StringUtil } from "../../../../entity/misc/string/util/string-util";
import { BaseComponent } from "../../../base.component";

@Component({
  selector: 'menu-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './menu-select.component.html',
  styleUrl: './menu-select.component.scss'
})
export class MenuSelectComponent extends BaseComponent {

  @Input() baseHtmlId: string;

  @Input() availableKeys: string[] | undefined;

  @Output() keyWasSelected: EventEmitter<string>;

  @Output() addNewButtonClicked: EventEmitter<boolean>;

  selectedKey: string | undefined;

  constructor() {
    super();
    this.baseHtmlId = "";

    this.availableKeys = [];
    this.selectedKey = undefined;
    this.keyWasSelected = new EventEmitter<string>();
    this.addNewButtonClicked = new EventEmitter<boolean>();
  }

  selectKey(): void {
    if(StringUtil.isNotEmpty(this.selectedKey)) {
      this.keyWasSelected.emit(this.selectedKey);
    }
    this.resetSelect();
  }

  addNewObject(): void {
    this.addNewButtonClicked.emit(true);
    this.resetSelect();
  }

  resetSelect(): void {
    this.selectedKey = undefined;
  }
}
