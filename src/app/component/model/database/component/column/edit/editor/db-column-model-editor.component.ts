import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { StringUtil } from "../../../../../../../entity/misc/string/util/string-util";
import { DbColumnModel } from "../../../../../../../entity/model/database/component/column/db-column-model";
import { DbTableModel } from "../../../../../../../entity/model/database/component/table/db-table-model";
import { BaseComponent } from "../../../../../../base.component";
import { SimpleMenuSelectComponent } from "../../../../../../edit/menu/select/simple/simple-menu-select.component";
import { DbColumnModelEditFormComponent } from "../form/db-column-model-edit-form.component";

@Component({
  selector: "db-column-model-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DbColumnModelEditFormComponent,
    SimpleMenuSelectComponent
],
  templateUrl: "./db-column-model-editor.component.html",
  styleUrl: "./db-column-model-editor.component.scss"
})
export class DbColumnModelEditorComponent extends BaseComponent implements OnInit {

  @Input() tableModelForEditObservable: Observable<DbTableModel | undefined>;

  @Output() columnModelWasUpdated: EventEmitter<boolean>;

  columnModelNameSelectedForEdit: string | undefined;

  columnModelForEdit$: BehaviorSubject<DbColumnModel | undefined>;

  tableModelId: number;

  allColumnModels: DbColumnModel[];

  baseHtmlId: string;

  simpleMenuSelectBaseHtmlId: string;

  simpleMenuSelectLabelName: string;

  constructor() {
    super();

    this.tableModelForEditObservable = of(undefined);
    this.columnModelWasUpdated = new EventEmitter<boolean>();

    this.columnModelNameSelectedForEdit = undefined;
    this.columnModelForEdit$ = new BehaviorSubject<DbColumnModel | undefined>( undefined );
    this.tableModelId = -1;
    this.allColumnModels = [];
    this.baseHtmlId = "columnModelEditor";
    this.simpleMenuSelectBaseHtmlId = this.baseHtmlId + "_ColumnSelect";
    this.simpleMenuSelectLabelName = "columns";
  }

  ngOnInit(): void {
    let tableModelBeingEditedSubscription = this.tableModelForEditObservable.subscribe({
                                                                                next: (nextTableModelBeingEdited: DbTableModel | undefined) => {
                                                                                  if (nextTableModelBeingEdited) {
                                                                                    this.setTableModelForEdit(nextTableModelBeingEdited);
                                                                                  }
                                                                                },
                                                                                error: (err: any) => {
                                                                                  throw new Error( "Failed to load the Table Model for editing due to [" + err + "]" );
                                                                                },
                                                                                complete: () => {
                                                                                  console.log("Finished loading the Table Model for edit");
                                                                                }
                                                                              });
    this.addLongLivingSubscription(tableModelBeingEditedSubscription);
  }

  loadColumnModelForEdit(columnNameSelected: string): void {
    if (StringUtil.isNotEmpty(columnNameSelected)) {
      this.columnModelNameSelectedForEdit = columnNameSelected;

      this.findAndSetColumnModelForEdit();
    }
  }

  getAvailableColumnModelKeys(): string[] {
    return this.allColumnModels.map((columnModel: DbColumnModel) => {
      return columnModel.name;
    });
  }

  resetEdit(): void {
    this.columnModelNameSelectedForEdit = undefined;
    this.setColumnModelForEdit(undefined);
  }

  resetAfterUpdate(): void {
    this.resetEdit();

    this.columnModelWasUpdated.emit(true);
  }

  private setTableModelForEdit( tableModelForEdit: DbTableModel | undefined ): void {
    if (tableModelForEdit) {
      this.tableModelId = tableModelForEdit.id;

      if (tableModelForEdit.columns) {
        this.allColumnModels = tableModelForEdit.columns;
      } else {
        this.allColumnModels = [];
      }
      this.setColumnModelForEdit(undefined);
    }
  }

  private findAndSetColumnModelForEdit(): void {
    let columnModelForEdit = this.allColumnModels.find((columnModel: DbColumnModel) => {
      return columnModel.name === this.columnModelNameSelectedForEdit;
    });
    if (!columnModelForEdit) {
      console.error( "Unable to find the Column Model with name [" + this.columnModelNameSelectedForEdit + "]" );
    } else {
      this.setColumnModelForEdit(columnModelForEdit);
    }
  }

  private setColumnModelForEdit( columnModelForEdit: DbColumnModel | undefined ): void {
    this.columnModelForEdit$.next(columnModelForEdit);
  }
}
