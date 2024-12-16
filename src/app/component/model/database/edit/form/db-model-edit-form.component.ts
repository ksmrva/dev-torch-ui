import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { RegexMatcher } from "../../../../../entity/misc/regex/matcher/regex-matcher";
import { DbCollectionCategory } from "../../../../../entity/model/database/detail/category/collection/db-collection-category";
import { DbFieldCategory } from "../../../../../entity/model/database/detail/category/field/db-field-category";
import { SqlDatabaseDetailCreateArgs } from "../../../../../entity/model/database/detail/sql/create/sql-database-detail-create-args";
import { SqlDatabaseDetailPath } from "../../../../../entity/model/database/detail/sql/path/sql-database-path";
import { SqlDatabaseDetail } from "../../../../../entity/model/database/detail/sql/sql-database-detail";
import { DbModelSourceConfig } from "../../../../../entity/model/database/source/config/db-model-source-config";
import { SqlModelDetailService } from "../../../../../service/model/database/detail/sql/sql-model-detail.service";
import { DatabaseModelSourceService } from "../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../base.component";
import { SqlColumnCategoryMatcherEditorComponent } from "../../detail/sql/column/category/matcher/edit/editor/sql-column-category-matcher-editor.component";
import { SqlTableCategoryMatcherEditorComponent } from "../../detail/sql/table/category/matcher/edit/editor/sql-table-category-matcher-editor.component";
import { SqlTableModelDetailEditorComponent } from "../../detail/sql/table/edit/editor/sql-table-model-detail-editor.component";

@Component({
  selector: "db-model-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SqlColumnCategoryMatcherEditorComponent,
    SqlTableCategoryMatcherEditorComponent,
    SqlTableModelDetailEditorComponent
  ],
  templateUrl: "./db-model-edit-form.component.html",
  styleUrl: "./db-model-edit-form.component.scss"
})
export class DbModelEditFormComponent extends BaseComponent implements OnInit {

  @Input() databaseForEditObservable: Observable< SqlDatabaseDetail | undefined >;

  @Output() databaseWasUpdated: EventEmitter<boolean>;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  databaseEditForm: FormGroup;

  databaseForEdit: SqlDatabaseDetail | undefined;

  databaseForEdit$: BehaviorSubject<SqlDatabaseDetail | undefined>;

  tableCategoryMatchersForNewModel: RegexMatcher<DbCollectionCategory>[];

  columnCategoryMatchersForNewModel: RegexMatcher<DbFieldCategory>[];

  availableSourceConfigs: DbModelSourceConfig[];

  constructor(
    private sqlModelDetailService: SqlModelDetailService,
    private databaseModelSourceService: DatabaseModelSourceService,
    formBuilder: FormBuilder
  ) {
    super();
    this.databaseForEditObservable = of(undefined);
    this.databaseWasUpdated = new EventEmitter<boolean>();
    this.resetEditButtonClicked = new EventEmitter<boolean>();

    this.databaseEditForm = formBuilder.group({
      sourceConfigId: new FormControl(-1),
      databaseName: new FormControl(""),
      schemaName: new FormControl(""),
      description: new FormControl("")
    });

    this.databaseForEdit = undefined;
    this.databaseForEdit$ = new BehaviorSubject<SqlDatabaseDetail | undefined>( undefined );
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

    let databaseToEditSubscription = this.databaseForEditObservable.subscribe({
                                                                        next: (databaseForEdit: SqlDatabaseDetail | undefined) => {
                                                                          this.setDatabaseForEdit(databaseForEdit);
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to load the SQL Database Detail for editing due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished loading the SQL Database Detail for edit");
                                                                        }
                                                                      });
    this.addLongLivingSubscription(databaseToEditSubscription);
  }

  saveDatabase(): void {
    if (
      !this.databaseEditForm
      || !this.databaseEditForm.value
      || !this.databaseEditForm.valid
    ) {
      // TODO: handle error
    }
    if (this.databaseForEdit) {
      if (
        this.databaseForEdit.id !== null
        && this.databaseForEdit.id !== undefined
        && this.databaseForEdit.id >= 0
      ) {
        let databaseForUpdate = new SqlDatabaseDetail();
        databaseForUpdate.id = this.databaseForEdit.id;
        databaseForUpdate.name = this.databaseEditForm.value.name;
        databaseForUpdate.description = this.databaseEditForm.value.description;

        // Don"t attempt to save any Tables with this call, they have their own form
        databaseForUpdate.tables = [];

        this.sqlModelDetailService.updateDatabase(databaseForUpdate).subscribe({
                                                                        next: (updatedDatabase: SqlDatabaseDetail | undefined) => {
                                                                          if (updatedDatabase) {
                                                                            this.resetDatabaseEditAfterSave();
                                                                          } else {
                                                                            throw new Error("Failed to update the SQL Database Detail");
                                                                          }
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to update the SQL Database Detail due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished updating the SQL Database Detail");
                                                                        }
                                                                      });
      } else {
        let databaseCreateArgs = new SqlDatabaseDetailCreateArgs();
        databaseCreateArgs.sourceConfigId = this.databaseEditForm.value.sourceConfigId;

        let databasePath = new SqlDatabaseDetailPath();
        databasePath.databaseName = this.databaseEditForm.value.databaseName;
        databasePath.schemaName = this.databaseEditForm.value.schemaName;

        databaseCreateArgs.path = databasePath;
        databaseCreateArgs.tableCategoryMatchers = this.tableCategoryMatchersForNewModel;
        databaseCreateArgs.columnCategoryMatchers = this.columnCategoryMatchersForNewModel;

        this.sqlModelDetailService.createDatabase(databaseCreateArgs).subscribe({
                                                                        next: (createdDatabase: SqlDatabaseDetail | undefined) => {
                                                                          if (createdDatabase) {
                                                                            this.resetDatabaseEditAfterSave();
                                                                          } else {
                                                                            throw new Error("Failed to create the SQL Database Detail");
                                                                          }
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

  isDatabaseNew(databaseToCheck: SqlDatabaseDetail | undefined): boolean {
    let isDatbaseNew = false;
    if (databaseToCheck) {
      isDatbaseNew = databaseToCheck.isNewEntity();
    }
    return isDatbaseNew;
  }

  resetDatabaseEditForms(): void {
    this.tableCategoryMatchersForNewModel = [];
    this.columnCategoryMatchersForNewModel = [];

    this.databaseEditForm.reset();
    this.databaseForEdit = undefined;
  }

  resetDatabaseEditAfterSave(): void {
    this.resetDatabaseEditForms();

    this.databaseWasUpdated.emit(true);
  }

  resetDatabaseEdit(): void {
    this.resetDatabaseEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  private setDatabaseForEdit( databaseForEdit: SqlDatabaseDetail | undefined ): void {
    if (databaseForEdit) {
      this.databaseForEdit = databaseForEdit;

      this.setFormValues(this.databaseForEdit);
      this.databaseForEdit$.next(this.databaseForEdit);
    }
  }

  private setFormValues(databaseForEdit: SqlDatabaseDetail): void {
    let databaseName = "";
    let schemaName = "";
    let databasePath = databaseForEdit.name;
    if (databasePath) {
      databaseName = databasePath.databaseName;
      schemaName = databasePath.schemaName;
    }

    this.databaseEditForm.setValue({
      sourceConfigId: -1,
      databaseName: databaseName,
      schemaName: schemaName,
      description: databaseForEdit.description
    });
  }

}
