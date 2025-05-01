import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { NavOptionGroupComponent } from '../../../../../../../shared/nav/option/group/nav-option-group.component';
import { SqlDatabaseDetail } from '../../../../../../../../entity/model/database/detail/sql/sql-database-detail';
import { SqlDatabaseDetailNavOptionItemComponent } from '../../../../sql/nav/option/item/sql-database-detail-nav-option-item.component';

@Component({
  selector: 'database-model-detail-nav-option-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionGroupComponent,
    SqlDatabaseDetailNavOptionItemComponent
  ],
  templateUrl: './database-model-detail-nav-option-group.component.html',
  styleUrl: './database-model-detail-nav-option-group.component.scss'
})
export class DatabaseModelDetailNavOptionGroupComponent extends BaseComponent implements OnInit {

  @Input() closeAllOptionsObservable: Observable<boolean>;

  @Output() sqlDatabaseOptionOpenEvent: EventEmitter<boolean>;

  @Output() sqlDatabaseSelectedEvent: EventEmitter<SqlDatabaseDetail | undefined>;

  @Output() toggleOptionsEvent: EventEmitter<boolean>;

  groupTitle: string;

  baseHtmlId: string;

  showOptions: boolean;

  constructor() {
    super();
    this.closeAllOptionsObservable = of(true);
    this.sqlDatabaseOptionOpenEvent = new EventEmitter<boolean>();
    this.sqlDatabaseSelectedEvent = new EventEmitter<SqlDatabaseDetail | undefined>();
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
    this.baseHtmlId = "databaseModelDetailNavOptionGroup";
    this.closeOptions();
  }

  handleNewSqlDatabaseAddEvent(newSqlDatabaseIsBeingAdded: boolean): void {
    if(newSqlDatabaseIsBeingAdded) {
      this.closeOptions();
    }
  }

  handleSqlDatabaseOptionOpen(sqlDatabaseOptionOpen: boolean): void {
    this.sqlDatabaseOptionOpenEvent.emit(sqlDatabaseOptionOpen);
  }

  handleToggleOptionsEvent(optionsOpen: boolean): void {
    this.toggleOptionsEvent.emit(optionsOpen);
  }

  sqlDatabaseSelected(selectedSqlDatabase: SqlDatabaseDetail | undefined): void {
    this.sqlDatabaseSelectedEvent.emit(selectedSqlDatabase);
  }

  openOptions(): void {
    this.showOptions = true;
  }

  closeOptions(): void {
    this.showOptions = false;
  }

}
