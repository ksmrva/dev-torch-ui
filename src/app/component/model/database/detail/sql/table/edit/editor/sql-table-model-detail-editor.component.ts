import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable, BehaviorSubject, of } from "rxjs";
import { StringUtil } from "../../../../../../../../entity/misc/string/util/string-util";
import { SqlDatabaseDetail } from "../../../../../../../../entity/model/database/detail/sql/sql-database-detail";
import { SqlTableDetail } from "../../../../../../../../entity/model/database/detail/sql/table/sql-table-detail";
import { BaseComponent } from "../../../../../../../base.component";
import { SimpleMenuSelectComponent } from "../../../../../../../edit/menu/select/simple/simple-menu-select.component";
import { SqlTableModelDetailEditFormComponent } from "../form/sql-table-model-detail-edit-form.component";

@Component({
  selector: "sql-table-model-detail-editor",
  standalone: true,
  imports: [
    CommonModule,
    SqlTableModelDetailEditFormComponent,
    SimpleMenuSelectComponent
],
  templateUrl: "./sql-table-model-detail-editor.component.html",
  styleUrl: "./sql-table-model-detail-editor.component.scss"
})
export class SqlTableModelDetailEditorComponent extends BaseComponent implements OnInit {

  @Input() databaseForEditObservable: Observable< SqlDatabaseDetail | undefined >;

  @Output() tableWasUpdated: EventEmitter<boolean>;

  tableNameSelectedForEdit: string | undefined;

  tableForEdit$: BehaviorSubject<SqlTableDetail | undefined>;

  allTables: SqlTableDetail[];

  baseHtmlId: string;

  simpleMenuSelectBaseHtmlId: string;

  simpleMenuSelectLabelName: string;

  constructor() {
    super();
    this.databaseForEditObservable = of(undefined);
    this.tableWasUpdated = new EventEmitter<boolean>();

    this.tableNameSelectedForEdit = undefined;
    this.tableForEdit$ = new BehaviorSubject<SqlTableDetail | undefined>( undefined );
    this.allTables = [];
    this.baseHtmlId = "sqlTableDetailEditor";
    this.simpleMenuSelectBaseHtmlId = this.baseHtmlId + "_TableSelect";
    this.simpleMenuSelectLabelName = "tables";
  }

  ngOnInit(): void {
    let databaseBeingEditedSubscription = this.databaseForEditObservable.subscribe({
                                                                            next: (nextDatabaseBeingEdited: SqlDatabaseDetail | undefined) => {
                                                                              this.setDatabaseForEdit(nextDatabaseBeingEdited);
                                                                            },
                                                                            error: (err: any) => {
                                                                              throw new Error( "Failed to load the SQL Database Detail for editing due to [" + err + "]" );
                                                                            },
                                                                            complete: () => {
                                                                              console.log("Finished loading the SQL Database Detail for edit");
                                                                            }
                                                                          });
    this.addLongLivingSubscription(databaseBeingEditedSubscription);
  }

  loadTableForEdit(tableNameSelected: string): void {
    if (StringUtil.isNotEmpty(tableNameSelected)) {
      this.tableNameSelectedForEdit = tableNameSelected;

      this.findAndSetTableForEdit();
    }
  }

  getAvailableTableNames(): string[] {
    return this.allTables.map((table: SqlTableDetail) => {
      return table.name;
    });
  }

  resetEdit(): void {
    this.tableNameSelectedForEdit = undefined;
    this.setTableForEdit(undefined);
  }

  resetAfterUpdate(): void {
    this.resetEdit();

    this.tableWasUpdated.emit(true);
  }

  private setDatabaseForEdit( databaseForEdit: SqlDatabaseDetail | undefined ): void {
    if (databaseForEdit) {
      if (databaseForEdit.tables) {
        this.allTables = databaseForEdit.tables;
      } else {
        this.allTables = [];
      }
      this.setTableForEdit(undefined);
    }
  }

  private findAndSetTableForEdit(): void {
    let tableForEdit = this.allTables.find((table: SqlTableDetail) => {
      return table.name === this.tableNameSelectedForEdit;
    });
    if (!tableForEdit) {
      console.error( "Unable to find the SQL Table Detail with name [" + this.tableNameSelectedForEdit + "]" );
    } else {
      this.setTableForEdit(tableForEdit);
    }
  }

  private setTableForEdit( tableForEdit: SqlTableDetail | undefined ): void {
    this.tableForEdit$.next(tableForEdit);
  }
}
