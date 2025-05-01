import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { StringUtil } from '../../../../../../../../entity/shared/string/util/string-util';
import { DatabaseModelSourceService } from '../../../../../../../../service/model/database/source/db-model-source.service';
import { ModalService } from '../../../../../../../../service/shared/modal/modal.service';
import { NavOptionItemComponent } from '../../../../../../../shared/nav/option/item/nav-option-item.component';
import { SqlDatabaseDetail } from '../../../../../../../../entity/model/database/detail/sql/sql-database-detail';
import { SqlModelDetailService } from '../../../../../../../../service/model/database/detail/sql/sql-model-detail.service';
import { SqlDatabaseDetailPath } from '../../../../../../../../entity/model/database/detail/sql/path/sql-database-path';
import { SqlDatabaseDetailEditModalComponent } from '../../../edit/modal/sql-database-detail-edit-modal.component';

@Component({
  selector: 'sql-database-detail-nav-option-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionItemComponent,
    SqlDatabaseDetailEditModalComponent
  ],
  templateUrl: './sql-database-detail-nav-option-item.component.html',
  styleUrl: './sql-database-detail-nav-option-item.component.scss'
})
export class SqlDatabaseDetailNavOptionItemComponent extends BaseComponent implements OnInit {

  @Input() closeOptionItem: Observable<boolean>;

  @Output() optionItemOpenEvent: EventEmitter<boolean>;

  @Output() keySelectedEvent: EventEmitter<SqlDatabaseDetail | undefined>;

  @Output() addNewEvent: EventEmitter<boolean>;

  selectedDetail: SqlDatabaseDetail | undefined;

  detailForEdit$: BehaviorSubject<SqlDatabaseDetail | undefined>;

  availableDetailPaths: SqlDatabaseDetailPath[];

  selectButtonTitle: string;

  navOptionBaseHtmlId: string;

  editModalBaseHtmlId: string;

  constructor(
    private modalService: ModalService,
    private sqlModelDetailService: SqlModelDetailService
  ) {
    super();
    this.closeOptionItem = of(false);
    this.optionItemOpenEvent = new EventEmitter<boolean>();
    this.keySelectedEvent = new EventEmitter<SqlDatabaseDetail | undefined>();
    this.addNewEvent = new EventEmitter<boolean>();

    this.selectedDetail = undefined;
    this.detailForEdit$ = new BehaviorSubject<SqlDatabaseDetail | undefined>( undefined );
    this.availableDetailPaths = [];
    this.navOptionBaseHtmlId = "";
    this.selectButtonTitle = "";
    this.editModalBaseHtmlId = "";
  }

  ngOnInit(): void {
    let closeOptionItemSubscription = this.closeOptionItem.subscribe({
                                                              next: (closeOptionItem: boolean) => {
                                                                if(closeOptionItem) {
                                                                  this.closeEditModal();
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

    let availableDetailPathsSubscription = this.sqlModelDetailService.getAvailableDatabaseDetailPaths().subscribe({
                                                                                                            next: (nextDetailPaths: SqlDatabaseDetailPath[] | undefined) => {
                                                                                                              if (!nextDetailPaths) {
                                                                                                                throw new Error("Failed to get the available SQL Database Detail Paths");
                                                                                                              }
                                                                                                              this.availableDetailPaths = nextDetailPaths;
                                                                                                            },
                                                                                                            error: (err: any) => {
                                                                                                              throw new Error( "Failed to load the available SQL Database Detail Paths due to [" + err + "]" );
                                                                                                            },
                                                                                                            complete: () => {
                                                                                                              console.log("Finished loading the available SQL Database Detail Paths");
                                                                                                            }
                                                                                                          });
    this.addLongLivingSubscription(availableDetailPathsSubscription);

    this.selectButtonTitle = "sql";
    this.navOptionBaseHtmlId = "sqlDatabaseDetailNavOptionItem";
    this.editModalBaseHtmlId = this.navOptionBaseHtmlId + "_DetailEditModal";
  }

  getAvailableFullDetailPaths(): string[] {
    let availableFullPaths: string[] = [];
    if(this.availableDetailPaths) {
      this.availableDetailPaths.forEach((detailPath: SqlDatabaseDetailPath) => {
        availableFullPaths.push(detailPath.getFullPath());
      });
    }
    return availableFullPaths;
  }

  loadNewDetailForEdit(): void {
    this.detailForEdit$.next(new SqlDatabaseDetail());

    this.openEditModal();
    this.addNewEvent.emit(true);
  }

  loadSelectedDetailForEdit(): void {
    if(this.selectedDetail) {
      this.detailForEdit$.next(this.selectedDetail);

      this.openEditModal();
    } else {
      console.warn("No SQL Database Detail selected, therefore the Edit can not be opened");
    }
  }

  detailSelected(selectedDetailFullPath: string | undefined): void {
    if (selectedDetailFullPath
      && StringUtil.isNotEmpty(selectedDetailFullPath)) {
        if(!this.availableDetailPaths || this.availableDetailPaths.length === 0) {
            throw new Error("SQL Database Detail Path [" + selectedDetailFullPath + "] was provided for selection, but there were no Available Paths");
        }

        let detailPathFound = this.availableDetailPaths.find((availableDetailPath: SqlDatabaseDetailPath) => {
          return availableDetailPath.getFullPath() === selectedDetailFullPath;
        });

        if(!detailPathFound) {
          throw new Error("SQL Database Detail Path [" + selectedDetailFullPath + "] was provided for selection, but the Path could not be found in the Available Paths Array");
        }

        this.sqlModelDetailService.getDatabaseDetail(detailPathFound).subscribe({
                                                                          next: (detailResult: SqlDatabaseDetail | undefined) => {
                                                                            if (!detailResult) {
                                                                              throw new Error("Failed to get the SQL Database Detail using Path [" + detailPathFound + "]");
                                                                            }
                                                                            this.selectedDetail = detailResult;
                                                                          },
                                                                          error: (err: any) => {
                                                                            throw new Error( "Failed to load the SQL Database Detail using Path [" + detailPathFound + "] due to [" + err + "]" );
                                                                          },
                                                                          complete: () => {
                                                                            console.log("Finished loading the SQL Database Detail using Path [" + detailPathFound + "]");
                                                                          }
                                                                        });
    } else {
      console.warn( "Was provided an undefined or empty SQL Database Detail Path" );
    }
  }

  handleOptionItemOpenEvent(isOptionItemOpen: boolean): void {
    this.optionItemOpenEvent.emit(isOptionItemOpen);
  }

  openEditModal(): void {
    this.modalService.open(this.editModalBaseHtmlId);
  }

  closeEditModal(): void {
    this.modalService.close();
  }

}
