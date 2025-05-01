import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import { DbFieldCategory } from "../../../../../../../../entity/model/database/detail/category/field/db-field-category";
import { SqlColumnDetail } from "../../../../../../../../entity/model/database/detail/sql/column/sql-column-detail";
import { DbModelSourceDataType } from "../../../../../../../../entity/model/database/source/type/db-model-source-data-type";
import { DatabaseModelDetailService } from "../../../../../../../../service/model/database/detail/db-model-detail.service";
import { DatabaseModelSourceService } from "../../../../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../../../../shared/base/base.component";
import { SqlModelDetailService } from "../../../../../../../../service/model/database/detail/sql/sql-model-detail.service";

@Component({
  selector: "sql-column-detail-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./sql-column-detail-edit-form.component.html",
  styleUrl: "./sql-column-detail-edit-form.component.scss"
})
export class SqlColumnDetailEditFormComponent extends BaseComponent implements OnInit {

  @Input() columnForEditObservable: Observable<SqlColumnDetail | undefined>;

  @Input() tableId: number;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  @Output() columnWasUpdated: EventEmitter<boolean>;

  columnEditForm: FormGroup;

  columnForEdit: SqlColumnDetail | undefined;

  availableColumnCategories: DbFieldCategory[];

  availableDataTypes: DbModelSourceDataType[];

  constructor(
    private sqlModelDetailService: SqlModelDetailService,
    private databaseModelSourceService: DatabaseModelSourceService,
    private databaseModelDetailService: DatabaseModelDetailService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.columnForEditObservable = of(undefined);
    this.tableId = -1;
    this.resetEditButtonClicked = new EventEmitter<boolean>();
    this.columnWasUpdated = new EventEmitter<boolean>();

    this.columnEditForm = this.formBuilder.group({
      name: new FormControl(""),
      description: new FormControl(""),
      isNullable: new FormControl(false),
      isAutoIncrement: new FormControl(false),
      columnIndex: new FormControl(0),
      dataType: new FormControl(undefined),
      columnCategory: new FormControl(undefined)
    });

    this.columnForEdit = undefined;
    this.availableColumnCategories = [];
    this.availableDataTypes = [];
  }

  ngOnInit(): void {
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

    let availableColumnCategoriesSubscription = this.databaseModelDetailService.getFieldCategories().subscribe({
                                                                                                        next: (columnCategories: DbFieldCategory[] | undefined) => {
                                                                                                          if (!columnCategories) {
                                                                                                            throw new Error("Failed to initialize the SQL Column Categories");
                                                                                                          }
                                                                                                          this.availableColumnCategories = columnCategories;
                                                                                                        },
                                                                                                        error: (err: any) => {
                                                                                                          throw new Error( "Failed to initialize the SQL Column Categories due to [" + err + "]" );
                                                                                                        },
                                                                                                        complete: () => {
                                                                                                          console.log("Finished initializing SQL Column Categories");
                                                                                                        }
                                                                                                      });
    this.addLongLivingSubscription(availableColumnCategoriesSubscription);

    let columnToEditSubscription =this.columnForEditObservable.subscribe({
                                                                    next: (column: SqlColumnDetail | undefined) => {
                                                                      this.setColumnForEdit(column);
                                                                    },
                                                                    error: (err: any) => {
                                                                      throw new Error( "Failed to load the SQL Column Detail for editing due to [" + err + "]" );
                                                                    },
                                                                    complete: () => {
                                                                      console.log("Finished loading the SQL Column Detail for edit");
                                                                    }
                                                                  });
    this.addLongLivingSubscription(columnToEditSubscription);
  }

  saveColumnModel(): void {
    if (
      !this.columnEditForm
      || !this.columnEditForm.value
      || !this.columnEditForm.valid
    ) {
      // TODO: handle error
    }
    let columnIdForSave = -1;
    if (this.columnForEdit) {
      columnIdForSave = this.columnForEdit.id;
    }

    let columnForUpdate = new SqlColumnDetail();
    columnForUpdate.id = columnIdForSave;
    columnForUpdate.tableId = this.tableId;
    columnForUpdate.name = this.columnEditForm.value.name;
    columnForUpdate.description = this.columnEditForm.value.description;
    columnForUpdate.isNullable = this.columnEditForm.value.isNullable;
    columnForUpdate.isAutoIncrement = this.columnEditForm.value.isAutoIncrement;
    columnForUpdate.columnIndex = this.columnEditForm.value.columnIndex;
    columnForUpdate.dataType = this.columnEditForm.value.dataType;
    columnForUpdate.columnCategory = this.columnEditForm.value.columnCategory;

    this.sqlModelDetailService.updateColumn(columnForUpdate).subscribe({
                                                                  next: (updatedColumn: SqlColumnDetail | undefined) => {
                                                                    if (updatedColumn) {
                                                                      this.resetColumnEditAfterUpdate();
                                                                    } else {
                                                                      throw new Error("Failed to update the SQL Column Detail");
                                                                    }
                                                                  },
                                                                  error: (err: any) => {
                                                                    throw new Error( "Failed to update the SQL Column Detail due to [" + err + "]" );
                                                                  },
                                                                  complete: () => {
                                                                    console.log("Finished updating the SQL Column Detail");
                                                                  }
                                                                });
  }

  isColumnNew(columnToCheck: SqlColumnDetail | undefined): boolean {
    let isColumnNew = false;
    if (columnToCheck) {
      isColumnNew = columnToCheck.isNewEntity();
    }
    return isColumnNew;
  }

  resetColumnEditForms(): void {
    this.columnEditForm.reset();
    this.columnForEdit = undefined;
  }

  resetColumnEdit(): void {
    this.resetColumnEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  resetColumnEditAfterUpdate(): void {
    this.resetColumnEditForms();

    this.columnWasUpdated.emit(true);
  }

  private setColumnForEdit(columnForEdit: SqlColumnDetail | undefined) {
    if (columnForEdit) {
      let currentColumnCategory = this.availableColumnCategories.find((availableColumnCategory: DbFieldCategory) => {
          return availableColumnCategory.name === columnForEdit.columnCategory.name;
      });
      if (!currentColumnCategory) {
        currentColumnCategory = this.getUndefinedColumnCategory();
        if (!currentColumnCategory) {
          throw new Error( "Unable to resolve the SQL Column Category value for undefined columns" );
        }
      }

      let currentDataType = this.availableDataTypes.find((availableDataType: DbModelSourceDataType) => {
        return availableDataType.name === columnForEdit.dataType.name;
      });
      if (!currentDataType) {
        currentDataType = this.getUndefinedDataType();
        if (!currentDataType) {
          throw new Error( "Unable to resolve the Database Model Source Data Type value for undefined data" );
        }
      }

      this.columnEditForm.setValue({
        name: columnForEdit.name,
        description: columnForEdit.description,
        isNullable: columnForEdit.isNullable,
        isAutoIncrement: columnForEdit.isAutoIncrement,
        columnIndex: columnForEdit.columnIndex,
        dataType: currentDataType,
        columnCategory: currentColumnCategory,
      });
      this.columnForEdit = columnForEdit;
    } else {
      console.warn("Was provided an undefined/null SQL Column Detail for editing, ignoring");
    }
  }

  private getUndefinedColumnCategory(): DbFieldCategory | undefined {
    return this.availableColumnCategories.find((availableColumnCategory: DbFieldCategory) => {
      return DbFieldCategory.isNameEqualToUndefinedCategory(availableColumnCategory.name);
    });
  }

  private getUndefinedDataType(): DbModelSourceDataType | undefined {
    return this.availableDataTypes.find((availableDataType: DbModelSourceDataType) => {
      return DbModelSourceDataType.isNameEqualToUndefinedType(availableDataType.name);
    });
  }

}
