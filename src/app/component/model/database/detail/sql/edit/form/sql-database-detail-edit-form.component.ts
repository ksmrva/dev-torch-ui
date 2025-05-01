import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { RegexMatcher } from "../../../../../../../entity/shared/regex/matcher/regex-matcher";
import { DbCollectionCategory } from "../../../../../../../entity/model/database/detail/category/collection/db-collection-category";
import { DbFieldCategory } from "../../../../../../../entity/model/database/detail/category/field/db-field-category";
import { SqlDatabaseDetailCreateArgs } from "../../../../../../../entity/model/database/detail/sql/create/sql-database-detail-create-args";
import { SqlDatabaseDetailPath } from "../../../../../../../entity/model/database/detail/sql/path/sql-database-path";
import { SqlDatabaseDetail } from "../../../../../../../entity/model/database/detail/sql/sql-database-detail";
import { DbModelSourceConfig } from "../../../../../../../entity/model/database/source/config/db-model-source-config";
import { SqlModelDetailService } from "../../../../../../../service/model/database/detail/sql/sql-model-detail.service";
import { DatabaseModelSourceService } from "../../../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../../../shared/base/base.component";
import { SqlColumnCategoryMatcherEditorComponent } from "../../column/category/matcher/edit/editor/sql-column-category-matcher-editor.component";
import { SqlTableCategoryMatcherEditorComponent } from "../../table/category/matcher/edit/editor/sql-table-category-matcher-editor.component";
import { SqlTableDetailEditorComponent } from "../../table/edit/editor/sql-table-detail-editor.component";

@Component({
  selector: "sql-database-detail-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SqlColumnCategoryMatcherEditorComponent,
    SqlTableCategoryMatcherEditorComponent,
    SqlTableDetailEditorComponent
  ],
  templateUrl: "./sql-database-detail-edit-form.component.html",
  styleUrl: "./sql-database-detail-edit-form.component.scss"
})
export class SqlDatabaseDetailEditFormComponent extends BaseComponent implements OnInit {

  @Input() detailForEditObservable: Observable< SqlDatabaseDetail | undefined >;

  @Output() detailWasUpdated: EventEmitter<boolean>;

  @Output() cancelButtonClickedEvent: EventEmitter<boolean>;

  detailEditForm: FormGroup;

  detailForEdit: SqlDatabaseDetail | undefined;

  detailForEdit$: BehaviorSubject<SqlDatabaseDetail | undefined>;

  tableCategoryMatchersForNewModel: RegexMatcher<DbCollectionCategory>[];

  columnCategoryMatchersForNewModel: RegexMatcher<DbFieldCategory>[];

  availableSourceConfigs: DbModelSourceConfig[];

  constructor(
    private sqlModelDetailService: SqlModelDetailService,
    private databaseModelSourceService: DatabaseModelSourceService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.detailForEditObservable = of(undefined);
    this.detailWasUpdated = new EventEmitter<boolean>();
    this.cancelButtonClickedEvent = new EventEmitter<boolean>();

    this.detailEditForm = this.formBuilder.group({
      sourceConfigId: new FormControl(-1),
      databaseName: new FormControl(""),
      schemaName: new FormControl(""),
      description: new FormControl("")
    });

    this.detailForEdit = undefined;
    this.detailForEdit$ = new BehaviorSubject<SqlDatabaseDetail | undefined>( undefined );
    this.tableCategoryMatchersForNewModel = [];
    this.columnCategoryMatchersForNewModel = [];
    this.availableSourceConfigs = [];
  }

  ngOnInit(): void {
    let availableSourceConfigsSubscription = this.databaseModelSourceService.getConfigs().subscribe({
                                                                                              next: (sourceConfigs: DbModelSourceConfig[] | undefined) => {
                                                                                                if (!sourceConfigs) {
                                                                                                  throw new Error("Failed to load the available Database Model Source Configs");
                                                                                                }
                                                                                                this.availableSourceConfigs = sourceConfigs;
                                                                                              },
                                                                                              error: (err: any) => {
                                                                                                throw new Error( "Failed to load the available Database Model Source Configs due to [" + err + "]" );
                                                                                              },
                                                                                              complete: () => {
                                                                                                console.log("Finished loading the available Database Model Source Configs");
                                                                                              }
                                                                                            });
    this.addLongLivingSubscription(availableSourceConfigsSubscription);

    let detailToEditSubscription = this.detailForEditObservable.subscribe({
                                                                    next: (detailForEdit: SqlDatabaseDetail | undefined) => {
                                                                      this.setDetailForEdit(detailForEdit);
                                                                    },
                                                                    error: (err: any) => {
                                                                      throw new Error( "Failed to load the SQL Database Detail for editing due to [" + err + "]" );
                                                                    },
                                                                    complete: () => {
                                                                      console.log("Finished loading the SQL Database Detail for edit");
                                                                    }
                                                                  });
    this.addLongLivingSubscription(detailToEditSubscription);
  }

  saveDetail(): void {
    if (
      !this.detailEditForm
      || !this.detailEditForm.value
      || !this.detailEditForm.valid
    ) {
      // TODO: handle error
    }
    if (this.detailForEdit) {
      if (
        this.detailForEdit.id !== null
        && this.detailForEdit.id !== undefined
        && this.detailForEdit.id >= 0
      ) {
        let detailForUpdate = new SqlDatabaseDetail();
        detailForUpdate.id = this.detailForEdit.id;

        let path = new SqlDatabaseDetailPath();
        path.databaseName = this.detailEditForm.value.databaseName;
        path.schemaName = this.detailEditForm.value.schemaName;

        detailForUpdate.path = path;
        detailForUpdate.description = this.detailEditForm.value.description;

        // Don"t attempt to save any Tables with this call, they have their own form
        detailForUpdate.tables = [];

        this.sqlModelDetailService.updateDatabase(detailForUpdate).subscribe({
                                                                        next: (updatedDetail: SqlDatabaseDetail | undefined) => {
                                                                          if (!updatedDetail) {
                                                                            throw new Error("Failed to update the SQL Database Detail");
                                                                          }
                                                                          this.handleSuccessfulSave();
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to update the SQL Database Detail due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished updating the SQL Database Detail");
                                                                        }
                                                                      });
      } else {
        let detailCreateArgs = new SqlDatabaseDetailCreateArgs();
        detailCreateArgs.sourceConfigId = this.detailEditForm.value.sourceConfigId;

        let path = new SqlDatabaseDetailPath();
        path.databaseName = this.detailEditForm.value.databaseName;
        path.schemaName = this.detailEditForm.value.schemaName;

        detailCreateArgs.path = path;
        detailCreateArgs.tableCategoryMatchers = this.tableCategoryMatchersForNewModel;
        detailCreateArgs.columnCategoryMatchers = this.columnCategoryMatchersForNewModel;

        this.sqlModelDetailService.createDatabaseDetail(detailCreateArgs).subscribe({
                                                                              next: (createdDetail: SqlDatabaseDetail | undefined) => {
                                                                                if (!createdDetail) {
                                                                                  throw new Error("Failed to create the SQL Database Detail");
                                                                                }

                                                                                this.handleSuccessfulSave();
                                                                              },
                                                                              error: (err: any) => {
                                                                                throw new Error( "Failed to create the SQL Database Detail due to [" + err + "]" );
                                                                              },
                                                                              complete: () => {
                                                                                console.log("Finished create the SQL Database Detail");
                                                                              }
                                                                            });
      }
    }
  }

  isDetailNew(detailToCheck: SqlDatabaseDetail | undefined): boolean {
    let isDetailNew = false;
    if (detailToCheck) {
      isDetailNew = detailToCheck.isNewEntity();
    }
    return isDetailNew;
  }

  resetEditForms(): void {
    this.tableCategoryMatchersForNewModel = [];
    this.columnCategoryMatchersForNewModel = [];

    this.detailEditForm.reset();
    this.detailForEdit = undefined;
  }

  handleSuccessfulSave(): void {
    this.resetEditForms();

    this.detailWasUpdated.emit(true);
  }

  cancelButtonClicked(): void {
    this.resetEditForms();

    this.cancelButtonClickedEvent.emit(true);
  }

  private setDetailForEdit( detailForEdit: SqlDatabaseDetail | undefined ): void {
    if (detailForEdit) {
      this.detailForEdit = detailForEdit;

      this.setFormValues(this.detailForEdit);
      this.detailForEdit$.next(detailForEdit);
    }
  }

  private setFormValues(detailForEdit: SqlDatabaseDetail): void {
    let databaseName = "";
    let schemaName = "";
    let detailPath = detailForEdit.path;
    if (detailPath) {
      databaseName = detailPath.databaseName;
      schemaName = detailPath.schemaName;
    }

    this.detailEditForm.setValue({
      sourceConfigId: -1,
      databaseName: databaseName,
      schemaName: schemaName,
      description: detailForEdit.description
    });
  }

}
