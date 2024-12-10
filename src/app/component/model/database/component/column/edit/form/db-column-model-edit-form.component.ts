import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import { DbColumnCategory } from "../../../../../../../entity/model/database/component/column/category/db-column-category";
import { DbColumnModel } from "../../../../../../../entity/model/database/component/column/db-column-model";
import { DbModelComponentService } from "../../../../../../../service/model/database/component/db-model-component.service";
import { BaseComponent } from "../../../../../../base.component";
import { DbModelSourceDataType } from "../../../../../../../entity/model/database/source/type/db-model-source-data-type";
import { DbModelSourceService } from "../../../../../../../service/model/database/source/db-model-source.service";

@Component({
  selector: "db-column-model-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./db-column-model-edit-form.component.html",
  styleUrl: "./db-column-model-edit-form.component.scss"
})
export class DbColumnModelEditFormComponent extends BaseComponent implements OnInit {

  @Input() columnModelForEditObservable: Observable<DbColumnModel | undefined>;

  @Input() tableModelId: number;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  @Output() columnModelWasUpdated: EventEmitter<boolean>;

  columnModelEditForm: FormGroup;

  columnModelForEdit: DbColumnModel | undefined;

  availableColumnCategories: DbColumnCategory[];

  availableDataTypes: DbModelSourceDataType[];

  constructor(
    private databaseModelSourceService: DbModelSourceService,
    private databaseModelComponentService: DbModelComponentService,
    formBuilder: FormBuilder
  ) {
    super();
    this.columnModelForEditObservable = of(undefined);
    this.tableModelId = -1;
    this.resetEditButtonClicked = new EventEmitter<boolean>();
    this.columnModelWasUpdated = new EventEmitter<boolean>();

    this.columnModelEditForm = formBuilder.group({
      name: new FormControl(""),
      description: new FormControl(""),
      isNullable: new FormControl(false),
      isAutoIncrement: new FormControl(false),
      columnIndex: new FormControl(0),
      dataType: new FormControl(undefined),
      columnCategory: new FormControl(undefined)
    });

    this.columnModelForEdit = undefined;
    this.availableColumnCategories = [];
    this.availableDataTypes = [];
  }

  ngOnInit(): void {
    // Get all Database Data Types to allow updates
    let availableDataTypesSubscription = this.databaseModelSourceService.getDataTypes().subscribe({
                                                                                        next: (dataTypes: DbModelSourceDataType[] | undefined) => {
                                                                                          if (!dataTypes) {
                                                                                            throw new Error("Failed to initialize the Database Model Source Data Types");
                                                                                          }
                                                                                          this.availableDataTypes = dataTypes;
                                                                                        },
                                                                                        error: (err: any) => {
                                                                                          throw new Error( "Failed to initialize the Database Model Source Data Types due to [" + err + "]" );
                                                                                        },
                                                                                        complete: () => {
                                                                                          console.log("Finished initializing Database Model Source Data Types");
                                                                                        }
                                                                                      });
    this.addLongLivingSubscription(availableDataTypesSubscription);

    // Get all Column Categories to allow updates
    let availableColumnCategoriesSubscription = this.databaseModelComponentService.getColumnCategories().subscribe({
                                                                                                  next: (columnCategories: DbColumnCategory[] | undefined) => {
                                                                                                    if (!columnCategories) {
                                                                                                      throw new Error("Failed to initialize the Column Categories");
                                                                                                    }
                                                                                                    this.availableColumnCategories = columnCategories;
                                                                                                  },
                                                                                                  error: (err: any) => {
                                                                                                    throw new Error( "Failed to initialize the Column Categories due to [" + err + "]" );
                                                                                                  },
                                                                                                  complete: () => {
                                                                                                    console.log("Finished initializing Column Categories");
                                                                                                  }
                                                                                                });
    this.addLongLivingSubscription(availableColumnCategoriesSubscription);

    let columnModelToEditSubscription =this.columnModelForEditObservable.subscribe({
                                                                          next: (columnModel: DbColumnModel | undefined) => {
                                                                            this.setColumnModelForEdit(columnModel);
                                                                          },
                                                                          error: (err: any) => {
                                                                            throw new Error( "Failed to load the Column Model for editing due to [" + err + "]" );
                                                                          },
                                                                          complete: () => {
                                                                            console.log("Finished loading the Column Model for edit");
                                                                          }
                                                                        });
    this.addLongLivingSubscription(columnModelToEditSubscription);
  }

  saveColumnModel(): void {
    if (
      !this.columnModelEditForm
      || !this.columnModelEditForm.value
      || !this.columnModelEditForm.valid
    ) {
      // TODO: handle error
    }
    let columnModelIdForSave = -1;
    if (this.columnModelForEdit) {
      columnModelIdForSave = this.columnModelForEdit.id;
    }

    let columnModelForUpdate = new DbColumnModel();
    columnModelForUpdate.id = columnModelIdForSave;
    columnModelForUpdate.tableId = this.tableModelId;
    columnModelForUpdate.name = this.columnModelEditForm.value.name;
    columnModelForUpdate.description = this.columnModelEditForm.value.description;
    columnModelForUpdate.isNullable = this.columnModelEditForm.value.isNullable;
    columnModelForUpdate.isAutoIncrement = this.columnModelEditForm.value.isAutoIncrement;
    columnModelForUpdate.columnIndex = this.columnModelEditForm.value.columnIndex;
    columnModelForUpdate.dataType = this.columnModelEditForm.value.dataType;
    columnModelForUpdate.columnCategory = this.columnModelEditForm.value.columnCategory;

    this.databaseModelComponentService.updateColumn(columnModelForUpdate).subscribe({
                                                                        next: (updatedColumnModel: DbColumnModel | undefined) => {
                                                                          if (updatedColumnModel) {
                                                                            this.resetColumnModelEditAfterUpdate();
                                                                          } else {
                                                                            throw new Error("Failed to update the Database Column Model");
                                                                          }
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to update the Database Column Model due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished updating the Database Column Model");
                                                                        }
                                                                      });
  }

  isColumnModelNew(columnModel: DbColumnModel | undefined): boolean {
    let isColumnModelNew = false;
    if (columnModel && columnModel.isNewEntity()) {
      isColumnModelNew = true;
    }
    return isColumnModelNew;
  }

  resetColumnModelEditForms(): void {
    this.columnModelEditForm.reset();
    this.columnModelForEdit = undefined;
  }

  resetColumnModelEdit(): void {
    this.resetColumnModelEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  resetColumnModelEditAfterUpdate(): void {
    this.resetColumnModelEditForms();

    this.columnModelWasUpdated.emit(true);
  }

  private setColumnModelForEdit(columnModelForEdit: DbColumnModel | undefined) {
    if (columnModelForEdit) {
      let currentColumnCategory = this.availableColumnCategories.find((availableColumnCategory: DbColumnCategory) => {
          return availableColumnCategory.name === columnModelForEdit.columnCategory.name;
      });
      if (!currentColumnCategory) {
        currentColumnCategory = this.getUndefinedColumnCategory();
        if (!currentColumnCategory) {
          throw new Error( "Unable to resolve the Column Category value for undefined columns" );
        }
      }

      let currentDataType = this.availableDataTypes.find((availableDataType: DbModelSourceDataType) => {
        return availableDataType.name === columnModelForEdit.dataType.name;
      });
      if (!currentDataType) {
        currentDataType = this.getUndefinedDataType();
        if (!currentDataType) {
          throw new Error( "Unable to resolve the Database Model Source Data Type value for undefined data" );
        }
      }

      this.columnModelEditForm.setValue({
        name: columnModelForEdit.name,
        description: columnModelForEdit.description,
        isNullable: columnModelForEdit.isNullable,
        isAutoIncrement: columnModelForEdit.isAutoIncrement,
        columnIndex: columnModelForEdit.columnIndex,
        dataType: currentDataType,
        columnCategory: currentColumnCategory,
      });
      this.columnModelForEdit = columnModelForEdit;
    } else {
      console.warn("Was provided an undefined/null Column Model for editing, ignoring");
    }
  }

  private getUndefinedColumnCategory(): DbColumnCategory | undefined {
    return this.availableColumnCategories.find((availableColumnCategory: DbColumnCategory) => {
      return DbColumnCategory.isNameEqualToUndefinedCategory(availableColumnCategory.name);
    });
  }

  private getUndefinedDataType(): DbModelSourceDataType | undefined {
    return this.availableDataTypes.find((availableDataType: DbModelSourceDataType) => {
      return DbModelSourceDataType.isNameEqualToUndefinedType(availableDataType.name);
    });
  }
}
