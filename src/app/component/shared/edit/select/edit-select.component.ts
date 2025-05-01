import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StringUtil } from "../../../../entity/shared/string/util/string-util";
import { BaseComponent } from "../../base/base.component";

@Component({
  selector: 'edit-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-select.component.html',
  styleUrl: './edit-select.component.scss'
})
export class EditSelectComponent extends BaseComponent implements OnInit {

  @Input() parentHtmlId: string;

  @Input() availableKeys: string[] | undefined;

  @Input() showTitle: boolean;

  @Output() keyWasSelected: EventEmitter<string>;

  @Output() addNewButtonClicked: EventEmitter<boolean>;

  @Output() editButtonClicked: EventEmitter<boolean>;

  selectedKey: string | undefined;

  baseHtmlId: string;

  constructor() {
    super();
    this.parentHtmlId = "";
    this.availableKeys = [];
    this.showTitle = false;
    this.keyWasSelected = new EventEmitter<string>();
    this.addNewButtonClicked = new EventEmitter<boolean>();
    this.editButtonClicked = new EventEmitter<boolean>();

    this.selectedKey = undefined;
    this.baseHtmlId = "";
  }

  ngOnInit(): void {
    this.baseHtmlId = this.parentHtmlId + "_Content";
  }

  selectKey(): void {
    if(StringUtil.isNotEmpty(this.selectedKey)) {
      this.keyWasSelected.emit(this.selectedKey);
    }
  }

  isKeySelected(): boolean {
    return !StringUtil.isEmpty(this.selectedKey);
  }

  handleAddNewButtonClick(): void {
    this.addNewButtonClicked.emit(true);
    this.resetSelect();
  }

  handleEditButtonClick(): void {
    this.editButtonClicked.emit(true);
  }

  resetSelect(): void {
    this.selectedKey = undefined;
  }

}
