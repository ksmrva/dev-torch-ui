import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { NavOptionGroupComponent } from '../../../../../../../shared/nav/option/group/nav-option-group.component';
import { BaseComponent } from '../../../../../../../shared/base/base.component';

@Component({
  selector: 'code-model-detail-nav-option-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionGroupComponent
  ],
  templateUrl: './code-model-detail-nav-option-group.component.html',
  styleUrl: './code-model-detail-nav-option-group.component.scss'
})
export class CodeModelDetailNavOptionGroupComponent extends BaseComponent implements OnInit {

  @Input() closeAllOptionsObservable: Observable<boolean>;

  @Output() toggleOptionsEvent: EventEmitter<boolean>;

  groupTitle: string;

  baseHtmlId: string;

  showOptions: boolean;

  constructor() {
    super();
    this.closeAllOptionsObservable = of(true);
    this.toggleOptionsEvent = new EventEmitter<boolean>();

    this.groupTitle = "";
    this.baseHtmlId = "";
    this.showOptions = false;
  }

  ngOnInit(): void {
    let closeAllOptionsSubscription = this.closeAllOptionsObservable.subscribe({
                                                                            next: (shouldCloseOptions: boolean) => {
                                                                              if(shouldCloseOptions) {
                                                                                this.closeOptions();
                                                                              }
                                                                            },
                                                                            error: (err: any) => {
                                                                              throw new Error( "Failed to receive command to close all Options due to [" + err + "]" );
                                                                            },
                                                                            complete: () => {
                                                                              console.log( "Finished receiving command to close all Options" );
                                                                            }
                                                                          });
    this.addLongLivingSubscription(closeAllOptionsSubscription);

    this.groupTitle = "detail";
    this.baseHtmlId = "codeModelDetailNavOptionGroup";
    this.closeOptions();
  }

  handleToggleOptionsEvent(optionsOpen: boolean): void {
    this.toggleOptionsEvent.emit(optionsOpen);
  }

  openOptions(): void {
    this.showOptions = true;
  }

  closeOptions(): void {
    this.showOptions = false;
  }

}
