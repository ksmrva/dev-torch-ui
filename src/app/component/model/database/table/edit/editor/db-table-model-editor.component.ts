import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable, BehaviorSubject, of } from "rxjs";
import { StringUtil } from "../../../../../../entity/helper/string/util/string-util";
import { DbModel } from "../../../../../../entity/model/database/db-model";
import { DbTableModel } from "../../../../../../entity/model/database/table/db-table-model";
import { BaseComponent } from "../../../../../base.component";
import { DbTableModelEditFormComponent } from "../form/db-table-model-edit-form.component";
import { SimpleMenuSelectComponent } from "../../../../../edit/menu/select/simple/simple-menu-select.component";

@Component({
  selector: "db-table-model-editor",
  standalone: true,
  imports: [
    CommonModule,
    DbTableModelEditFormComponent,
    SimpleMenuSelectComponent
],
  templateUrl: "./db-table-model-editor.component.html",
  styleUrl: "./db-table-model-editor.component.scss"
})
export class DbTableModelEditorComponent extends BaseComponent implements OnInit {

  @Input() dbModelForEditObservable: Observable< DbModel | undefined >;

  @Output() tableModelWasUpdated: EventEmitter<boolean>;

  tableModelNameSelectedForEdit: string | undefined;

  tableModelForEdit$: BehaviorSubject<DbTableModel | undefined>;

  dbModelId: number;

  allTableModels: DbTableModel[];

  baseHtmlId: string;

  simpleMenuSelectBaseHtmlId: string;

  simpleMenuSelectLabelName: string;

  constructor() {
    super();
    this.dbModelForEditObservable = of(undefined);
    this.tableModelWasUpdated = new EventEmitter<boolean>();

    this.tableModelNameSelectedForEdit = undefined;
    this.tableModelForEdit$ = new BehaviorSubject<DbTableModel | undefined>( undefined );
    this.dbModelId = -1;
    this.allTableModels = [];
    this.baseHtmlId = "tableModelEditor";
    this.simpleMenuSelectBaseHtmlId = this.baseHtmlId + "_TableSelect";
    this.simpleMenuSelectLabelName = "tables";
  }

  ngOnInit(): void {
    let dbModelBeingEditedSubscription = this.dbModelForEditObservable.subscribe({
                                                                                  next: (nextDbModelBeingEdited: DbModel | undefined) => {
                                                                                    this.setDbModelForEdit(nextDbModelBeingEdited);
                                                                                  },
                                                                                  error: (err: any) => {
                                                                                    throw new Error( "Failed to load the Database Model for editing due to [" + err + "]" );
                                                                                  },
                                                                                  complete: () => {
                                                                                    console.log("Finished loading the Database Model for edit");
                                                                                  }
                                                                                });
    this.addLongLivingSubscription(dbModelBeingEditedSubscription);
  }

  loadTableModelForEdit(tableNameSelected: string): void {
    if (StringUtil.isNotEmpty(tableNameSelected)) {
      this.tableModelNameSelectedForEdit = tableNameSelected;

      this.findAndSetTableModelForEdit();
    }
  }

  getAvailableTableModelKeys(): string[] {
    return this.allTableModels.map((tableModel: DbTableModel) => {
      return tableModel.name;
    });
  }

  resetEdit(): void {
    this.tableModelNameSelectedForEdit = undefined;
    this.setTableModelForEdit(undefined);
  }

  resetAfterUpdate(): void {
    this.resetEdit();

    this.tableModelWasUpdated.emit(true);
  }

  private setDbModelForEdit( dbModelForEdit: DbModel | undefined ): void {
    if (dbModelForEdit) {
      this.dbModelId = dbModelForEdit.id;

      if (dbModelForEdit.tables) {
        this.allTableModels = dbModelForEdit.tables;
      } else {
        this.allTableModels = [];
      }
      this.setTableModelForEdit(undefined);
    }
  }

  private findAndSetTableModelForEdit(): void {
    let tableModelForEdit = this.allTableModels.find((tableModel: DbTableModel) => {
      return tableModel.name === this.tableModelNameSelectedForEdit;
    });
    if (!tableModelForEdit) {
      console.error( "Unable to find the Table Model with name [" + this.tableModelNameSelectedForEdit + "]" );
    } else {
      this.setTableModelForEdit(tableModelForEdit);
    }
  }

  private setTableModelForEdit( tableModelForEdit: DbTableModel | undefined ): void {
    this.tableModelForEdit$.next(tableModelForEdit);
  }
}
