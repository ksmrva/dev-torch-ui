import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { RegexMatcher } from "../../../../../entity/helper/regex/matcher/regex-matcher";
import { DbColumnCategory } from "../../../../../entity/model/database/column/category/db-column-category";
import { DbModelCreateArgs } from "../../../../../entity/model/database/create/db-model-create-args";
import { DbModel } from "../../../../../entity/model/database/db-model";
import { DbModelName } from "../../../../../entity/model/database/name/db-model-name";
import { DbModelSourceConfig } from "../../../../../entity/model/database/source/config/db-model-source-config";
import { DbTableCategory } from "../../../../../entity/model/database/table/category/db-table-category";
import { DbModelService } from "../../../../../service/model/database/db-model.service";
import { DbModelSourceService } from "../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../base.component";
import { DbColumnCategoryMatcherEditorComponent } from "../../column/category/matcher/edit/editor/db-column-category-matcher-editor.component";
import { DbTableCategoryMatcherEditorComponent } from "../../table/category/matcher/edit/editor/db-table-category-matcher-editor.component";
import { DbTableModelEditorComponent } from "../../table/edit/editor/db-table-model-editor.component";

@Component({
  selector: "db-model-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DbColumnCategoryMatcherEditorComponent,
    DbTableCategoryMatcherEditorComponent,
    DbTableModelEditorComponent
  ],
  templateUrl: "./db-model-edit-form.component.html",
  styleUrl: "./db-model-edit-form.component.scss"
})
export class DbModelEditFormComponent extends BaseComponent implements OnInit {

  @Input() dbModelForEditObservable: Observable< DbModel | undefined >;

  @Output() dbModelWasUpdated: EventEmitter<boolean>;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  dbModelEditForm: FormGroup;

  dbModelForEdit: DbModel | undefined;

  dbModelForEdit$: BehaviorSubject<DbModel | undefined>;

  tableCategoryMatchersForNewModel: RegexMatcher<DbTableCategory>[];

  columnCategoryMatchersForNewModel: RegexMatcher<DbColumnCategory>[];

  availableSourceConfigs: DbModelSourceConfig[];

  constructor(
    private dbModelService: DbModelService,
    private dbModelSourceService: DbModelSourceService,
    formBuilder: FormBuilder
  ) {
    super();
    this.dbModelForEditObservable = of(undefined);
    this.dbModelWasUpdated = new EventEmitter<boolean>();
    this.resetEditButtonClicked = new EventEmitter<boolean>();

    this.dbModelEditForm = formBuilder.group({
      sourceConfigId: new FormControl(-1),
      databaseName: new FormControl(""),
      schemaName: new FormControl(""),
      description: new FormControl("")
    });

    this.dbModelForEdit = undefined;
    this.dbModelForEdit$ = new BehaviorSubject<DbModel | undefined>( undefined );
    this.tableCategoryMatchersForNewModel = [];
    this.columnCategoryMatchersForNewModel = [];
    this.availableSourceConfigs = [];
  }

  ngOnInit(): void {
    let availableSourceConfigsSubscription = this.dbModelSourceService.getSourceConfigs().subscribe({
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

    let dbModelToEditSubscription = this.dbModelForEditObservable.subscribe({
                                                                              next: (dbModel: DbModel | undefined) => {
                                                                                this.setDbModelForEdit(dbModel);
                                                                              },
                                                                              error: (err: any) => {
                                                                                throw new Error( "Failed to load the Database Model for editing due to [" + err + "]" );
                                                                              },
                                                                              complete: () => {
                                                                                console.log("Finished loading the Database Model for edit");
                                                                              }
                                                                            });
    this.addLongLivingSubscription(dbModelToEditSubscription);
  }

  saveDbModel(): void {
    if (
      !this.dbModelEditForm
      || !this.dbModelEditForm.value
      || !this.dbModelEditForm.valid
    ) {
      // TODO: handle error
    }
    if (this.dbModelForEdit) {
      if (
        this.dbModelForEdit.id !== null
        && this.dbModelForEdit.id !== undefined
        && this.dbModelForEdit.id >= 0
      ) {
        let dbModelForUpdate = new DbModel();
        dbModelForUpdate.id = this.dbModelForEdit.id;
        dbModelForUpdate.name = this.dbModelEditForm.value.name;
        dbModelForUpdate.description = this.dbModelEditForm.value.description;

        // Don"t attempt to save any Table Models with this call, they have their own form
        dbModelForUpdate.tables = [];

        this.dbModelService.updateDbModel(dbModelForUpdate).subscribe({
                                                                        next: (updatedDbModel: DbModel | undefined) => {
                                                                          if (updatedDbModel) {
                                                                            this.resetDbModelEditAfterSave();
                                                                          } else {
                                                                            throw new Error("Failed to update the Database Model");
                                                                          }
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to update the Database Model due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished updating the Database Model");
                                                                        }
                                                                      });
      } else {
        let dbModelCreateArgs = new DbModelCreateArgs();
        dbModelCreateArgs.sourceConfigId = this.dbModelEditForm.value.sourceConfigId;

        let dbModelName = new DbModelName();
        dbModelName.databaseName = this.dbModelEditForm.value.databaseName;
        dbModelName.schemaName = this.dbModelEditForm.value.schemaName;

        dbModelCreateArgs.name = dbModelName;
        dbModelCreateArgs.tableCategoryMatchers = this.tableCategoryMatchersForNewModel;
        dbModelCreateArgs.columnCategoryMatchers = this.columnCategoryMatchersForNewModel;

        this.dbModelService.createDbModel(dbModelCreateArgs).subscribe({
                                                                  next: (createdDbModel: DbModel | undefined) => {
                                                                    if (createdDbModel) {
                                                                      this.resetDbModelEditAfterSave();
                                                                    } else {
                                                                      throw new Error("Failed to create the Database Model");
                                                                    }
                                                                  },
                                                                  error: (err: any) => {
                                                                    throw new Error( "Failed to create the Database Model due to [" + err + "]" );
                                                                  },
                                                                  complete: () => {
                                                                    console.log("Finished create the Database Model");
                                                                  }
                                                                });
      }
    }
  }

  isDbModelNew(dbModel: DbModel | undefined): boolean {
    let isDbModelNew = false;
    if (dbModel && dbModel.isNewEntity()) {
      isDbModelNew = true;
    }
    return isDbModelNew;
  }

  resetDbModelEditForms(): void {
    this.tableCategoryMatchersForNewModel = [];
    this.columnCategoryMatchersForNewModel = [];

    this.dbModelEditForm.reset();
    this.dbModelForEdit = undefined;
  }

  resetDbModelEditAfterSave(): void {
    this.resetDbModelEditForms();

    this.dbModelWasUpdated.emit(true);
  }

  resetDbModelEdit(): void {
    this.resetDbModelEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  private setDbModelForEdit( dbModelForEdit: DbModel | undefined ): void {
    if (dbModelForEdit) {
      this.dbModelForEdit = dbModelForEdit;

      this.setFormValues(this.dbModelForEdit);
      this.dbModelForEdit$.next(this.dbModelForEdit);
    }
  }

  private setFormValues(dbModelForEdit: DbModel): void {
    let databaseName = "";
    let schemaName = "";
    let dbModelName = dbModelForEdit.name;
    if (dbModelName) {
      databaseName = dbModelName.databaseName;
      schemaName = dbModelName.schemaName;
    }

    this.dbModelEditForm.setValue({
      sourceConfigId: -1,
      databaseName: databaseName,
      schemaName: schemaName,
      description: dbModelForEdit.description
    });
  }

}
