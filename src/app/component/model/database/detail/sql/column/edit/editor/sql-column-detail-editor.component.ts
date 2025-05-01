import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { StringUtil } from "../../../../../../../../entity/shared/string/util/string-util";
import { SqlColumnDetail } from "../../../../../../../../entity/model/database/detail/sql/column/sql-column-detail";
import { SqlTableDetail } from "../../../../../../../../entity/model/database/detail/sql/table/sql-table-detail";
import { BaseComponent } from "../../../../../../../shared/base/base.component";
import { SqlColumnDetailEditFormComponent } from "../form/sql-column-detail-edit-form.component";
import { SimpleEditSelectComponent } from "../../../../../../../shared/edit/select/simple/simple-edit-select.component";

@Component({
  selector: "sql-column-detail-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SqlColumnDetailEditFormComponent,
    SimpleEditSelectComponent
],
  templateUrl: "./sql-column-detail-editor.component.html",
  styleUrl: "./sql-column-detail-editor.component.scss"
})
export class SqlColumnDetailEditorComponent extends BaseComponent implements OnInit {

  @Input() tableForEditObservable: Observable<SqlTableDetail | undefined>;

  @Output() columnWasUpdated: EventEmitter<boolean>;

  columnNameSelectedForEdit: string | undefined;

  columnForEdit$: BehaviorSubject<SqlColumnDetail | undefined>;

  tableId: number;

  allColumns: SqlColumnDetail[];

  baseHtmlId: string;

  simpleMenuSelectBaseHtmlId: string;

  simpleMenuSelectLabelName: string;

  constructor() {
    super();

    this.tableForEditObservable = of(undefined);
    this.columnWasUpdated = new EventEmitter<boolean>();

    this.columnNameSelectedForEdit = undefined;
    this.columnForEdit$ = new BehaviorSubject<SqlColumnDetail | undefined>( undefined );
    this.tableId = -1;
    this.allColumns = [];
    this.baseHtmlId = "sqlColumnDetailEditor";
    this.simpleMenuSelectBaseHtmlId = this.baseHtmlId + "_ColumnSelect";
    this.simpleMenuSelectLabelName = "columns";
  }

  ngOnInit(): void {
    let tableBeingEditedSubscription = this.tableForEditObservable.subscribe({
                                                                        next: (nextTableBeingEdited: SqlTableDetail | undefined) => {
                                                                          if (nextTableBeingEdited) {
                                                                            this.setTableForEdit(nextTableBeingEdited);
                                                                          }
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to load the SQL Table Detail for editing due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished loading the SQL Table Detail for edit");
                                                                        }
                                                                      });
    this.addLongLivingSubscription(tableBeingEditedSubscription);
  }

  loadColumnForEdit(columnNameSelected: string): void {
    if (StringUtil.isNotEmpty(columnNameSelected)) {
      this.columnNameSelectedForEdit = columnNameSelected;

      this.findAndSetColumnForEdit();
    }
  }

  getAvailableColumnNames(): string[] {
    return this.allColumns.map((column: SqlColumnDetail) => {
      return column.name;
    });
  }

  resetEdit(): void {
    this.columnNameSelectedForEdit = undefined;
    this.setColumnForEdit(undefined);
  }

  resetAfterUpdate(): void {
    this.resetEdit();

    this.columnWasUpdated.emit(true);
  }

  private setTableForEdit( tableForEdit: SqlTableDetail | undefined ): void {
    if (tableForEdit) {
      this.tableId = tableForEdit.id;

      if (tableForEdit.columns) {
        this.allColumns = tableForEdit.columns;
      } else {
        this.allColumns = [];
      }
      this.setColumnForEdit(undefined);
    }
  }

  private findAndSetColumnForEdit(): void {
    let columnForEdit = this.allColumns.find((column: SqlColumnDetail) => {
      return column.name === this.columnNameSelectedForEdit;
    });
    if (!columnForEdit) {
      console.error( "Unable to find the SQL Column Detail with name [" + this.columnNameSelectedForEdit + "]" );
    } else {
      this.setColumnForEdit(columnForEdit);
    }
  }

  private setColumnForEdit( columnForEdit: SqlColumnDetail | undefined ): void {
    this.columnForEdit$.next(columnForEdit);
  }

}
