import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditSelectComponent } from '../../../edit/select/edit-select.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'nav-option-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditSelectComponent
  ],
  templateUrl: './nav-option-item.component.html',
  styleUrl: './nav-option-item.component.scss'
})
export class NavOptionItemComponent extends BaseComponent implements OnInit {

  @Input() availableKeys: string[];

  @Input() selectButtonTitle: string;

  @Input() parentHtmlId: string;

  @Input() closeOptionItem: Observable<boolean>;

  @Output() optionItemOpenEvent: EventEmitter<boolean>;

  @Output() keySelectedEvent: EventEmitter<string | undefined>;

  @Output() addNewButtonClickedEvent: EventEmitter<boolean>;

  @Output() editButtonClickedEvent: EventEmitter<boolean>;

  selectedKey: string;

  showSelect: boolean;

  baseHtmlId: string;

  selectBaseHtmlId: string;

  additionalOptionItemClasses: string;

  additionalSelectToggleClasses: string;

  constructor() {
    super();
    this.availableKeys = [];
    this.selectButtonTitle = "";
    this.parentHtmlId = "";
    this.baseHtmlId = "";
    this.closeOptionItem = of(false);
    this.optionItemOpenEvent = new EventEmitter<boolean>();
    this.keySelectedEvent = new EventEmitter<string | undefined>();
    this.addNewButtonClickedEvent = new EventEmitter<boolean>();
    this.editButtonClickedEvent = new EventEmitter<boolean>();

    this.selectedKey = "";
    this.showSelect = false;
    this.parentHtmlId = "";
    this.selectBaseHtmlId = "";
    this.additionalOptionItemClasses = "";
    this.additionalSelectToggleClasses = "";
  }

  ngOnInit(): void {
    this.baseHtmlId = this.parentHtmlId + "_Content";
    this.selectBaseHtmlId = this.baseHtmlId + "_Select";

    let closeOptionItemSubscription = this.closeOptionItem.subscribe({
                                                                next: (closeOptionItem: boolean) => {
                                                                  if(closeOptionItem) {
                                                                    this.closeSelect();
                                                                  }
                                                                },
                                                                error: (err: any) => {
                                                                  throw new Error( "Failed to receive the command to close the Option Item due to [" + err + "]" );
                                                                },
                                                                complete: () => {
                                                                  console.log("Finished receiving the command to close the Option Item");
                                                                }
                                                              });
    this.addLongLivingSubscription(closeOptionItemSubscription);
  }

  keySelected(selectedKey: string): void {
    this.keySelectedEvent.emit(selectedKey);
  }

  addNewButtonClicked(): void {
    this.addNewButtonClickedEvent.emit(true);
  }

  editButtonClicked(): void {
    this.editButtonClickedEvent.emit(true);
  }

  toggleSelect(): void {
    if(this.showSelect) {
      this.closeSelect();

    } else {
      this.openSelect();

    }
  }

  openSelect(): void {
    this.showSelect = true;
    this.optionItemOpenEvent.emit(true);

    this.additionalOptionItemClasses = "pe-2";
    this.additionalSelectToggleClasses = "selected";
  }

  closeSelect(): void {
    this.showSelect = false;
    this.optionItemOpenEvent.emit(false);

    this.additionalOptionItemClasses = "";
    this.additionalSelectToggleClasses = "";
  }

}
