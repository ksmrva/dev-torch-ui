import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { DbCollectionCategory } from "../../../../../../../../entity/model/database/detail/category/collection/db-collection-category";
import { SqlTableDetail } from "../../../../../../../../entity/model/database/detail/sql/table/sql-table-detail";
import { DatabaseModelDetailService } from "../../../../../../../../service/model/database/detail/db-model-detail.service";
import { BaseComponent } from "../../../../../../../shared/base/base.component";
import { SqlColumnDetailEditorComponent } from "../../../column/edit/editor/sql-column-detail-editor.component";
import { SqlModelDetailService } from "../../../../../../../../service/model/database/detail/sql/sql-model-detail.service";

@Component({
  selector: "sql-table-detail-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SqlColumnDetailEditorComponent
  ],
  templateUrl: "./sql-table-detail-edit-form.component.html",
  styleUrl: "./sql-table-detail-edit-form.component.scss"
})
export class SqlTableDetailEditFormComponent extends BaseComponent implements OnInit {

  @Input() tableForEditObservable: Observable<SqlTableDetail | undefined>;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  @Output() tableWasUpdated: EventEmitter<boolean>;

  tableEditForm: FormGroup;

  tableForEdit: SqlTableDetail | undefined;

  tableForEdit$: BehaviorSubject<SqlTableDetail | undefined>;

  availableTableCategories: DbCollectionCategory[];

  constructor(
    private databaseModelDetailService: DatabaseModelDetailService,
    private sqlModelDetailService: SqlModelDetailService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.tableForEditObservable = of(undefined);
    this.resetEditButtonClicked = new EventEmitter<boolean>();
    this.tableWasUpdated = new EventEmitter<boolean>();

    this.tableEditForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      description: new FormControl(""),
      tableCategory: new FormControl(undefined)
    });

    this.tableForEdit = undefined;
    this.tableForEdit$ = new BehaviorSubject<SqlTableDetail | undefined>(undefined);
    this.availableTableCategories = [];
  }

  ngOnInit(): void {
    // Get all Table Categories to allow updates
    let availableTableCategoriesSubscription = this.databaseModelDetailService.getCollectionCategories().subscribe({
                                                                                                            next: (tableCategories: DbCollectionCategory[] | undefined) => {
                                                                                                              if (!tableCategories) {
                                                                                                                throw new Error("Failed to initialize the SQL Table Categories");
                                                                                                              }
                                                                                                              this.availableTableCategories = tableCategories;
                                                                                                            },
                                                                                                            error: (err: any) => {
                                                                                                              throw new Error("Failed to initialize the SQL Table Categories due to [" + err + "]");
                                                                                                            },
                                                                                                            complete: () => {
                                                                                                              console.log("Finished initializing SQL Table Categories");
                                                                                                            }
                                                                                                          });
    this.addLongLivingSubscription(availableTableCategoriesSubscription);

    let tableToEditSubscription = this.tableForEditObservable.subscribe({
                                                                  next: (table: SqlTableDetail | undefined) => {
                                                                    this.setTableForEdit(table);
                                                                  },
                                                                  error: (err: any) => {
                                                                  throw new Error("Failed to load the SQL Table Detail for editing due to [" + err + "]");
                                                                  },
                                                                  complete: () => {
                                                                    console.log("Finished loading the SQL Table Detail for edit");
                                                                  }
                                                                });
    this.addLongLivingSubscription(tableToEditSubscription);
  }

  saveTableModel(): void {
    if (!this.tableEditForm
      || !this.tableEditForm.value
      || !this.tableEditForm.valid
    ) {
      // TODO: handle error
    }
    let tableIdForSave = -1;
    if (this.tableForEdit) {
      tableIdForSave = this.tableForEdit.id;
    }

    let tableForUpdate = new SqlTableDetail();
    tableForUpdate.id = tableIdForSave;
    tableForUpdate.description = this.tableEditForm.value.description;

    //   description: string = "";
    // columnModels: ColumnModel[] = [];
    // primaryKeyModel: PrimaryKeyModel = new PrimaryKeyModel();
    // foreignKeyModels: ForeignKeyModel[] = [];
    // tableCategory: TableCategory = new TableCategory();
    //   columnModelForUpdate.name = this.columnModelEditForm.value.name;
    //   columnModelForUpdate.description = this.columnModelEditForm.value.description;
    //   columnModelForUpdate.isNullable = this.columnModelEditForm.value.isNullable;
    //   columnModelForUpdate.isAutoIncrement = this.columnModelEditForm.value.isAutoIncrement;
    //   columnModelForUpdate.columnIndex = this.columnModelEditForm.value.columnIndex;
    //   columnModelForUpdate.dataType = this.columnModelEditForm.value.dataType;
    //   columnModelForUpdate.columnCategory = this.columnModelEditForm.value.columnCategory;

    this.sqlModelDetailService.updateTable(tableForUpdate).subscribe({
                                                                next: (updatedTable: SqlTableDetail | undefined) => {
                                                                  if (updatedTable) {
                                                                    this.resetTableEditAfterUpdate();
                                                                  } else {
                                                                    throw new Error("Failed to update the SQL Table Detail");
                                                                  }
                                                                },
                                                                error: (err: any) => {
                                                                  throw new Error("Failed to update the SQL Table Detail due to [" + err + "]");
                                                                },
                                                                complete: () => {
                                                                  console.log("Finished updating the SQL Table Detail");
                                                                }
                                                              });
  }

  isTableNew(tableToCheck: SqlTableDetail | undefined): boolean {
    let isTableNew = false;
    if (tableToCheck) {
      isTableNew = tableToCheck.isNewEntity();
    }
    return isTableNew;
  }

  resetTableEditForms(): void {
    this.tableEditForm.reset();
    this.tableForEdit = undefined;
  }

  resetTableEdit(): void {
    this.resetTableEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  resetTableEditAfterUpdate(): void {
    this.resetTableEditForms();

    this.tableWasUpdated.emit(true);
  }

  private setTableForEdit(tableForEdit: SqlTableDetail | undefined) {
    if (tableForEdit) {
      let currentTableCategory = this.availableTableCategories.find((availableTableCategory: DbCollectionCategory) => {
        return availableTableCategory.name === tableForEdit.tableCategory.name;
      });
      if (!currentTableCategory) {
        currentTableCategory = this.getUndefinedTableCategory();
        if (!currentTableCategory) {
          throw new Error("Unable to resolve the Table Category value and the Undefined Category was not found");
        }
      }

      this.tableEditForm.setValue({
        name: tableForEdit.name,
        description: tableForEdit.description,
        tableCategory: currentTableCategory,
      });
      this.tableForEdit = tableForEdit;

      this.tableForEdit$.next(this.tableForEdit);
    } else {
      console.warn("Was provided an undefined/null SQL Table Detail for editing, ignoring");
    }
  }

  private getUndefinedTableCategory(): DbCollectionCategory | undefined {
    return this.availableTableCategories.find((availableTableCategory: DbCollectionCategory) => {
      return DbCollectionCategory.isNameEqualToUndefinedCategory(availableTableCategory.name);
    });
  }
}
