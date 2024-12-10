import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { StringUtil } from "../../../../../entity/misc/string/util/string-util";
import { DbModel } from "../../../../../entity/model/database/component/db-model";
import { DatabasePath } from "../../../../../entity/model/database/component/path/database-path";
import { DbModelComponentService } from "../../../../../service/model/database/component/db-model-component.service";
import { BaseComponent } from "../../../../base.component";
import { DbModelEditFormComponent } from "../form/db-model-edit-form.component";
import { MenuSelectComponent } from "../../../../edit/menu/select/menu-select.component";

@Component({
  selector: "db-model-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DbModelEditFormComponent,
    MenuSelectComponent
  ],
  templateUrl: "./db-model-editor.component.html",
  styleUrl: "./db-model-editor.component.scss"
})
export class DbModelEditorComponent extends BaseComponent implements OnInit {

  dbModelForEdit$: BehaviorSubject<DbModel | undefined>;

  availableDbModelNames: DatabasePath[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private dbModelService: DbModelComponentService
  ) {
    super();
    this.dbModelForEdit$ = new BehaviorSubject<DbModel | undefined>( undefined );
    this.availableDbModelNames = [];
    this.showSelect = true;
    this.baseHtmlId = "dbModelEditor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
  }

  ngOnInit(): void {
    let availableDbModelNamesSubscription = this.dbModelService.getAvailableDatabasePaths().subscribe({
                                                                                                        next: (dbModelNames: DatabasePath[] | undefined) => {
                                                                                                          if (!dbModelNames) {
                                                                                                            throw new Error("Failed to get the available Database Model Names");
                                                                                                          }
                                                                                                          this.availableDbModelNames = dbModelNames;
                                                                                                        },
                                                                                                        error: (err: any) => {
                                                                                                          throw new Error( "Failed to load the available Database Model Names due to [" + err + "]" );
                                                                                                        },
                                                                                                        complete: () => {
                                                                                                          console.log("Finished loading the available Database Model Names");
                                                                                                        }
                                                                                                      });
    this.addLongLivingSubscription(availableDbModelNamesSubscription);
  }

  getAvailableDbModelKeys(): string[] {
    return this.availableDbModelNames.map((dbModelName: DatabasePath) => {
      return dbModelName.getFullPath();
    });
  }

  loadNewDbModelForEdit(): void {
    this.setDbModelForEdit(new DbModel());
    this.showSelect = false;
  }

  loadDbModelForEdit(fullDatabaseNameSelected: string): void {
    if (StringUtil.isNotEmpty(fullDatabaseNameSelected)) {
      let dbModelNameSelected = this.getDbModelNameFromFullName(fullDatabaseNameSelected);
      this.dbModelService.getDatabase(dbModelNameSelected).subscribe({
                                                                      next: (loadedDbModel: DbModel | undefined) => {
                                                                        if (!loadedDbModel) {
                                                                          throw new Error( "Failed to load Database Model for editing using Name [" + fullDatabaseNameSelected + "]" );
                                                                        }
                                                                        this.setDbModelForEdit(loadedDbModel);
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error( "Failed to load Database Model for editing using Name [" + fullDatabaseNameSelected + "] due to [" + err + "]" );
                                                                      },
                                                                      complete: () => {
                                                                        console.log( "Finished loading the Database Model for edit using Name [" + fullDatabaseNameSelected + "]" );
                                                                      }
                                                                    });
    } else {
      console.error( "No Database Model Name was selected, unable to load for editing" );
    }
  }

  resetDbModelEdit(): void {
    this.setDbModelForEdit(undefined);
    this.showSelect = true;
  }

  private setDbModelForEdit( dbModelForEdit: DbModel | undefined ): void {
    this.dbModelForEdit$.next(dbModelForEdit);
    this.showSelect = false;
  }

  private getDbModelNameFromFullName(dbModelFullName: string): DatabasePath {
    let dbModelNameFound = this.availableDbModelNames.find((availableDbModelName: DatabasePath) => {
      return availableDbModelName.getFullPath() === dbModelFullName;
    });
    if(!dbModelNameFound) {
      this.resetDbModelEdit();
      throw new Error("Unable to find the Database Model name using the Full Name [" + dbModelFullName + "]");
    }
    return dbModelNameFound;
  }
}
