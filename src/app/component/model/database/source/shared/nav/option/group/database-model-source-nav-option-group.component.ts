import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NavOptionGroupComponent } from '../../../../../../../shared/nav/option/group/nav-option-group.component';
import { DatabaseModelSourceConfigNavOptionItemComponent } from '../../../../config/nav/option/item/database-model-source-config-nav-option-item.component';
import { DbModelSourceConfig } from '../../../../../../../../entity/model/database/source/config/db-model-source-config';
import { DatabaseModelSourceUrlNavOptionItemComponent } from '../../../../url/nav/option/item/database-model-source-url-nav-option-item.component';
import { DbModelSourceUrl } from '../../../../../../../../entity/model/database/source/url/db-model-source-url';

@Component({
  selector: 'database-model-source-nav-option-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionGroupComponent,
    DatabaseModelSourceUrlNavOptionItemComponent,
    DatabaseModelSourceConfigNavOptionItemComponent
  ],
  templateUrl: './database-model-source-nav-option-group.component.html',
  styleUrl: './database-model-source-nav-option-group.component.scss'
})
export class DatabaseModelSourceNavOptionGroupComponent extends BaseComponent implements OnInit {

  @Input() closeAllOptionsObservable: Observable<boolean>;

  @Output() configOptionOpenEvent: EventEmitter<boolean>;

  @Output() configSelectedEvent: EventEmitter<DbModelSourceConfig | undefined>;

  @Output() urlOptionOpenEvent: EventEmitter<boolean>;

  @Output() urlSelectedEvent: EventEmitter<DbModelSourceUrl | undefined>;

  @Output() toggleOptionsEvent: EventEmitter<boolean>;

  closeUrlOptionItem$: BehaviorSubject<boolean>;

  closeConfigOptionItem$: BehaviorSubject<boolean>;

  groupTitle: string;

  baseHtmlId: string;

  showOptions: boolean;

  constructor() {
    super();
    this.closeAllOptionsObservable = of(true);
    this.configOptionOpenEvent = new EventEmitter<boolean>();
    this.configSelectedEvent = new EventEmitter<DbModelSourceConfig | undefined>();
    this.urlOptionOpenEvent = new EventEmitter<boolean>();
    this.urlSelectedEvent = new EventEmitter<DbModelSourceUrl | undefined>();
    this.toggleOptionsEvent = new EventEmitter<boolean>();

    this.closeUrlOptionItem$ = new BehaviorSubject<boolean>(false);
    this.closeConfigOptionItem$ = new BehaviorSubject<boolean>(false);
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

    this.groupTitle = "source";
    this.baseHtmlId = "databaseModelSourceNavOptionGroup";
    this.closeOptions();
  }

  handleUrlOptionOpen(urlOptionOpen: boolean): void {
    if(urlOptionOpen) {
      this.closeConfigOptions();
    }

    this.urlOptionOpenEvent.emit(urlOptionOpen);
  }

  handleConfigOptionOpen(configOptionOpen: boolean): void {
    if(configOptionOpen) {
      this.closeUrlOptions();
    }

    this.configOptionOpenEvent.emit(configOptionOpen);
  }

  handleToggleOptionsEvent(optionsOpen: boolean): void {
    this.toggleOptionsEvent.emit(optionsOpen);
  }

  urlSelected(selectedUrl: DbModelSourceUrl | undefined): void {
    this.urlSelectedEvent.emit(selectedUrl);
  }

  configSelected(selectedConfig: DbModelSourceConfig | undefined): void {
    this.configSelectedEvent.emit(selectedConfig);
  }

  openOptions(): void {
    this.showOptions = true;
  }

  closeOptions(): void {
    this.showOptions = false;
    this.closeUrlOptions();
    this.closeConfigOptions();
  }

  closeUrlOptions(): void {
    this.closeUrlOptionItem$.next(true);

    this.urlOptionOpenEvent.emit(false);
    this.urlSelectedEvent.emit(undefined);
  }

  closeConfigOptions(): void {
    this.closeConfigOptionItem$.next(true);

    this.configOptionOpenEvent.emit(false);
    this.configSelectedEvent.emit(undefined);
  }


}
