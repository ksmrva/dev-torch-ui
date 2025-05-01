import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NAV_OPTION_TOGGLE_ACTIVATED_CLASS, NAV_OPTION_OPENED_TOGGLE_ICON_CLASS, NAV_OPTION_CLOSED_TOGGLE_ICON_CLASS } from '../../../../model/shared/menu/model-menu.component';

@Component({
  selector: 'nav-option-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './nav-option-group.component.html',
  styleUrl: './nav-option-group.component.scss'
})
export class NavOptionGroupComponent  extends BaseComponent implements OnInit {

  @Input() groupTitle: string;

  @Input() closeAllOptionsObservable: Observable<boolean>;

  @Input() baseHtmlId: string;

  @Output() toggleOptionsEvent: EventEmitter<boolean>;

  closeAllOptions$: BehaviorSubject<boolean>;

  showOptions: boolean;

  additionalOptionsToggleClasses: string;

  additionalOptionsToggleIconClasses: string;

  constructor() {
    super();
    this.groupTitle = "";
    this.closeAllOptionsObservable = of(true);
    this.baseHtmlId = "";
    this.toggleOptionsEvent = new EventEmitter<boolean>();

    this.closeAllOptions$ = new BehaviorSubject<boolean>(true);
    this.showOptions = false;
    this.additionalOptionsToggleClasses = "";
    this.additionalOptionsToggleIconClasses = "";
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

    this.closeOptions();
  }

  toggleOptions(): void {
    if(this.showOptions) {
      this.closeOptions();

    } else {
      this.openOptions();

    }
    this.toggleOptionsEvent.emit(this.showOptions);
  }

  openOptions(): void {
    this.showOptions = true;

    this.additionalOptionsToggleClasses = NAV_OPTION_TOGGLE_ACTIVATED_CLASS;
    this.additionalOptionsToggleIconClasses = NAV_OPTION_OPENED_TOGGLE_ICON_CLASS;
  }

  closeOptions(): void {
    this.showOptions = false;
    this.closeAllOptions$.next(true);

    this.additionalOptionsToggleClasses = "";
    this.additionalOptionsToggleIconClasses = NAV_OPTION_CLOSED_TOGGLE_ICON_CLASS;
  }

}
