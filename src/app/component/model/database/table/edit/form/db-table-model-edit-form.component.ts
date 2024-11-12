import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { DbTableCategory } from "../../../../../../entity/model/database/table/category/db-table-category";
import { DbTableModel } from "../../../../../../entity/model/database/table/db-table-model";
import { DbModelService } from "../../../../../../service/model/database/db-model.service";
import { DbColumnModelEditorComponent } from "../../../column/edit/editor/db-column-model-editor.component";
import { DbColumnModelEditFormComponent } from "../../../column/edit/form/db-column-model-edit-form.component";
import { BaseComponent } from "../../../../../base.component";

@Component({
  selector: "db-table-model-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DbColumnModelEditFormComponent,
    DbColumnModelEditorComponent
  ],
  templateUrl: "./db-table-model-edit-form.component.html",
  styleUrl: "./db-table-model-edit-form.component.scss"
})
export class DbTableModelEditFormComponent extends BaseComponent implements OnInit {

  @Input() tableModelForEditObservable: Observable<DbTableModel | undefined>;

  @Input() dbModelId: number;

  @Output() resetTableModelEditButtonClicked: EventEmitter<boolean>;

  @Output() tableModelWasUpdated: EventEmitter<boolean>;

  tableModelEditForm: FormGroup;

  tableModelForEdit: DbTableModel | undefined;

  tableModelForEdit$: BehaviorSubject<DbTableModel | undefined>;

  availableTableCategories: DbTableCategory[];

  constructor(
    private dbModelService: DbModelService,
    formBuilder: FormBuilder
  ) {
    super();
    this.tableModelForEditObservable = of(undefined);
    this.dbModelId = -1;
    this.resetTableModelEditButtonClicked = new EventEmitter<boolean>();
    this.tableModelWasUpdated = new EventEmitter<boolean>();

    this.tableModelEditForm = formBuilder.group({
      name: new FormControl("", Validators.required),
      description: new FormControl(""),
      tableCategory: new FormControl(undefined)
    });

    this.tableModelForEdit = undefined;
    this.tableModelForEdit$ = new BehaviorSubject<DbTableModel | undefined>(undefined);
    this.availableTableCategories = [];
  }

  ngOnInit(): void {
    // Get all Table Categories to allow updates
    let availableTableCategoriesSubscription = this.dbModelService.getTableCategories().subscribe({
                                                                                                next: (tableCategories: DbTableCategory[] | undefined) => {
                                                                                                  if (!tableCategories) {
                                                                                                    throw new Error("Failed to initialize the Table Categories");
                                                                                                  }
                                                                                                  this.availableTableCategories = tableCategories;
                                                                                                },
                                                                                                error: (err: any) => {
                                                                                                  throw new Error("Failed to initialize the Table Categories due to [" + err + "]");
                                                                                                },
                                                                                                complete: () => {
                                                                                                  console.log("Finished initializing Table Categories");
                                                                                                }
                                                                                              });
    this.addLongLivingSubscription(availableTableCategoriesSubscription);

    let tableModelToEditSubscription = this.tableModelForEditObservable.subscribe({
                                                                            next: (tableModel: DbTableModel | undefined) => {
                                                                              this.setTableModelForEdit(tableModel);
                                                                            },
                                                                            error: (err: any) => {
                                                                              throw new Error("Failed to load the Table Model for editing due to [" + err + "]");
                                                                            },
                                                                            complete: () => {
                                                                              console.log("Finished loading the Table Model for edit");
                                                                            }
                                                                          });
    this.addLongLivingSubscription(tableModelToEditSubscription);
  }

  saveTableModel(): void {
    if (!this.tableModelEditForm
      || !this.tableModelEditForm.value
      || !this.tableModelEditForm.valid
    ) {
      // TODO: handle error
    }
    let tableModelIdForSave = -1;
    if (this.tableModelForEdit) {
      tableModelIdForSave = this.tableModelForEdit.id;
    }

    let tableModelForUpdate = new DbTableModel();
    tableModelForUpdate.id = tableModelIdForSave;
    tableModelForUpdate.description = this.tableModelEditForm.value.description;

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

    this.dbModelService.updateTableModel(tableModelForUpdate).subscribe({
                                                                        next: (updatedTableModel: DbTableModel | undefined) => {
                                                                          if (updatedTableModel) {
                                                                            this.resetTableModelEditAfterUpdate();
                                                                          } else {
                                                                            throw new Error("Failed to update the Table Model");
                                                                          }
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error("Failed to update the Table Model due to [" + err + "]");
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished updating the Table Model");
                                                                        }
                                                                      });
  }

  isTableModelNew(tableModel: DbTableModel | undefined): boolean {
    let isTableModelNew = false;
    if (tableModel && tableModel.isNewEntity()) {
      isTableModelNew = true;
    }
    return isTableModelNew;
  }

  resetTableModelEditForms(): void {
    this.tableModelEditForm.reset();
    this.tableModelForEdit = undefined;
  }

  resetTableModelEdit(): void {
    this.resetTableModelEditForms();

    this.resetTableModelEditButtonClicked.emit(true);
  }

  resetTableModelEditAfterUpdate(): void {
    this.resetTableModelEditForms();

    this.tableModelWasUpdated.emit(true);
  }

  private setTableModelForEdit(tableModelForEdit: DbTableModel | undefined) {
    if (tableModelForEdit) {
      let currentTableCategory = this.availableTableCategories.find((availableTableCategory: DbTableCategory) => {
        return availableTableCategory.name === tableModelForEdit.tableCategory.name;
      });
      if (!currentTableCategory) {
        currentTableCategory = this.getUndefinedTableCategory();
        if (!currentTableCategory) {
          throw new Error("Unable to resolve the Table Category value and the Undefined Category was not found");
        }
      }

      this.tableModelEditForm.setValue({
        name: tableModelForEdit.name,
        description: tableModelForEdit.description,
        tableCategory: currentTableCategory,
      });
      this.tableModelForEdit = tableModelForEdit;

      this.tableModelForEdit$.next(this.tableModelForEdit);
    } else {
      console.warn("Was provided an undefined/null Table Model for editing, ignoring");
    }
  }

  private getUndefinedTableCategory(): DbTableCategory | undefined {
    return this.availableTableCategories.find((availableTableCategory: DbTableCategory) => {
      return DbTableCategory.isNameEqualToUndefinedCategory(availableTableCategory.name);
    });
  }
}
