import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { StringUtil } from "../../../../../entity/misc/string/util/string-util";
import { SqlDatabaseDetail } from "../../../../../entity/model/database/detail/sql/sql-database-detail";
import { SqlDatabaseDetailPath } from "../../../../../entity/model/database/detail/sql/path/sql-database-path";
import { DatabaseModelDetailService } from "../../../../../service/model/database/detail/db-model-detail.service";
import { BaseComponent } from "../../../../base.component";
import { DbModelEditFormComponent } from "../form/db-model-edit-form.component";
import { MenuSelectComponent } from "../../../../edit/menu/select/menu-select.component";
import { SqlModelDetailService } from "../../../../../service/model/database/detail/sql/sql-model-detail.service";

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

  databaseForEdit$: BehaviorSubject<SqlDatabaseDetail | undefined>;

  availableDatabasePaths: SqlDatabaseDetailPath[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private databaseModelDetailService: DatabaseModelDetailService,
    private sqlModelDetailService: SqlModelDetailService
  ) {
    super();
    this.databaseForEdit$ = new BehaviorSubject<SqlDatabaseDetail | undefined>( undefined );
    this.availableDatabasePaths = [];
    this.showSelect = true;
    this.baseHtmlId = "databaseDetailEditor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
  }

  ngOnInit(): void {
    let availableSqlDatabaseDetailPathsSubscription = this.sqlModelDetailService.getAvailableDatabasePaths().subscribe({
                                                                                                              next: (sqlDatabaseDetailPaths: SqlDatabaseDetailPath[] | undefined) => {
                                                                                                                if (!sqlDatabaseDetailPaths) {
                                                                                                                  throw new Error("Failed to get the available SQL Database Detail Paths");
                                                                                                                }
                                                                                                                this.availableDatabasePaths = sqlDatabaseDetailPaths;
                                                                                                              },
                                                                                                              error: (err: any) => {
                                                                                                                throw new Error( "Failed to load the available SQL Database Detail Paths due to [" + err + "]" );
                                                                                                              },
                                                                                                              complete: () => {
                                                                                                                console.log("Finished loading the available SQL Database Detail Paths");
                                                                                                              }
                                                                                                            });
    this.addLongLivingSubscription(availableSqlDatabaseDetailPathsSubscription);
  }

  getAvailableDatabasePaths(): string[] {
    return this.availableDatabasePaths.map((databasePath: SqlDatabaseDetailPath) => {
      return databasePath.getFullPath();
    });
  }

  loadNewDatabaseForEdit(): void {
    this.setDatabaseForEdit(new SqlDatabaseDetail());
    this.showSelect = false;
  }

  loadDatabaseForEdit(fullDatabasePathSelected: string): void {
    if (StringUtil.isNotEmpty(fullDatabasePathSelected)) {
      let databasePathSelected = this.getDatabasePathFromFullPath(fullDatabasePathSelected);
      this.sqlModelDetailService.getDatabase(databasePathSelected).subscribe({
                                                                      next: (loadedDatabase: SqlDatabaseDetail | undefined) => {
                                                                        if (!loadedDatabase) {
                                                                          throw new Error( "Failed to load SQL Database Detail for editing using Path [" + fullDatabasePathSelected + "]" );
                                                                        }
                                                                        this.setDatabaseForEdit(loadedDatabase);
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error( "Failed to load SQL Database Detail for editing using Path [" + fullDatabasePathSelected + "] due to [" + err + "]" );
                                                                      },
                                                                      complete: () => {
                                                                        console.log( "Finished loading the SQL Database Detail for edit using Path [" + fullDatabasePathSelected + "]" );
                                                                      }
                                                                    });
    } else {
      console.error( "No SQL Database Detail Path was selected, unable to load for editing" );
    }
  }

  resetDatabaseEdit(): void {
    this.setDatabaseForEdit(undefined);
    this.showSelect = true;
  }

  private setDatabaseForEdit( databaseForEdit: SqlDatabaseDetail | undefined ): void {
    this.databaseForEdit$.next(databaseForEdit);
    this.showSelect = false;
  }

  private getDatabasePathFromFullPath(databaseFullPath: string): SqlDatabaseDetailPath {
    let databasePathFound = this.availableDatabasePaths.find((availableDatabasePath: SqlDatabaseDetailPath) => {
      return availableDatabasePath.getFullPath() === databaseFullPath;
    });
    if(!databasePathFound) {
      this.resetDatabaseEdit();
      throw new Error("Unable to find the SQL Database Detail Path name using the Full Path [" + databaseFullPath + "]");
    }
    return databasePathFound;
  }

}
