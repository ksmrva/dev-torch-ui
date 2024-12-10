import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { StringUtil } from "../../../../entity/misc/string/util/string-util";
import { DbColumnCategory } from "../../../../entity/model/database/component/column/category/db-column-category";
import { DbColumnModel } from "../../../../entity/model/database/component/column/db-column-model";
import { DatabaseComponentCreateArgs } from "../../../../entity/model/database/component/create/database-component-create-args";
import { DatabasePath } from "../../../../entity/model/database/component/path/database-path";
import { DbTableCategory } from "../../../../entity/model/database/component/table/category/db-table-category";
import { DbTableModel } from "../../../../entity/model/database/component/table/db-table-model";
import { DbModel } from "../../../../entity/model/database/component/db-model";
import { BaseApiService } from "../../../base.api.service";

@Injectable({
  providedIn: "root"
})
export class DbModelComponentService extends BaseApiService {

  private databases$: BehaviorSubject<DbModel[]>;

  private availableDatabasePaths$: BehaviorSubject<DatabasePath[]>;

  private tableCategories$: BehaviorSubject<DbTableCategory[]>;

  private columnCategories$: BehaviorSubject<DbColumnCategory[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.databases$ = new BehaviorSubject<DbModel[]>([]);
    this.availableDatabasePaths$ = new BehaviorSubject<DatabasePath[]>([]);
    this.tableCategories$ = new BehaviorSubject<DbTableCategory[]>([]);
    this.columnCategories$ = new BehaviorSubject<DbColumnCategory[]>([]);

    this.initDatabasePaths();
    this.initTableCategories();
    this.initColumnCategories();
  }

  override getResourcePathForApiUrl(): string {
    return "/model/db/component";
  }

  getDatabases(): Observable<DbModel[]> {
    return this.databases$.asObservable();
  }

  getAvailableDatabasePaths(): Observable<DatabasePath[]> {
    return this.availableDatabasePaths$.asObservable();
  }

  getTableCategories(): Observable<DbTableCategory[]> {
    return this.tableCategories$.asObservable();
  }

  getColumnCategories(): Observable<DbColumnCategory[]> {
    return this.columnCategories$.asObservable();
  }

  createDatabase(databaseCreateArgs: DatabaseComponentCreateArgs): Observable<DbModel | undefined> {
    let createDatabaseResult: Observable<DbModel | undefined>;
    let databasePath = databaseCreateArgs.path;
    let databaseAlreadyCreated = this.availableDatabasePaths$.value.find((availableDatabasePath: DatabasePath) => {
      return availableDatabasePath.isEqualTo(databasePath);
    });

    if (databaseAlreadyCreated) {
      console.log("Not attempting to create Database Component with Path [" + databaseCreateArgs.path.getFullPath() + "] since it was found to already exist");
      createDatabaseResult = of(undefined);
    } else {
      createDatabaseResult = this.createDatabaseApiCall(databaseCreateArgs);
    }
    return createDatabaseResult;
  }

  getDatabase(databasePathToGet: DatabasePath): Observable<DbModel | undefined> {
    let databaseResult: Observable<DbModel | undefined>;
    let loadedDatabase = this.getDatabaseFromCache(databasePathToGet);
    if (loadedDatabase) {
      databaseResult = of(loadedDatabase);

    } else {
      console.info("Database Component with Path [" + databasePathToGet.getFullPath() + "] not found within the Loaded Database Components Map");
      databaseResult = this.getDatabaseApiCall(databasePathToGet);

    }
    return databaseResult;
  }

  updateDatabase(databaseForUpdate: DbModel): Observable<DbModel | undefined> {
    return of(undefined);
  }

  updateTable(tableForUpdate: DbTableModel): Observable<DbTableModel | undefined> {
    return of(undefined);
  }

  updateColumn(columnForUpdate: DbColumnModel): Observable<DbColumnModel | undefined> {
    return this.updateColumnApiCall(columnForUpdate);
  }

  private initDatabasePaths(): void {
    this.getAllDatabasePathsApiCall().subscribe({
                                            next: (databasePaths: DatabasePath[] | undefined) => {
                                              if (!databasePaths) {
                                                throw new Error("Failed to initialize the Database Model Component Paths");
                                              }
                                            },
                                            error: (err: any) => {
                                              throw new Error("Failed to initialize the Database Model Component Paths due to [" + err + "]");
                                            },
                                            complete: () => {
                                              console.log("Finished initializing Database Model Component Paths");
                                            }
                                          });
  }

  private initTableCategories(): void {
    this.getAllTableCategoriesApiCall().subscribe({
                                          next: (tableCategories: DbTableCategory[] | undefined) => {
                                            if (!tableCategories) {
                                              throw new Error("Failed to initialize the Table Categories");
                                            }
                                          },
                                          error: (err: any) => {
                                            throw new Error("Failed to initialize the Table Categories due to [" + err + "]");
                                          },
                                          complete: () => {
                                            console.log("Finished initializing Table Categories");
                                          }
                                        });
  }

  private initColumnCategories(): void {
    this.getAllColumnCategoriesApiCall().subscribe({
                                          next: (columnCategories: DbColumnCategory[] | undefined) => {
                                            if (!columnCategories) {
                                              throw new Error("Failed to initialize the Column Categories");
                                            }
                                          },
                                          error: (err: any) => {
                                            throw new Error("Failed to initialize the Column Categories due to [" + err + "]");
                                          },
                                          complete: () => {
                                            console.log("Finished initializing Column Categories");
                                          }
                                        });
  }

  private getDatabaseFromCache(databasePathToCheck: DatabasePath): DbModel | undefined {
    return this.databases$.value.find((database: DbModel) => {
      return database.name.isEqualTo(databasePathToCheck);
    });
  }

  private addDatabase(databaseToAdd: DbModel): void {
    if (databaseToAdd) {
      let databasePathToAdd = databaseToAdd.name;
      if (databasePathToAdd
        && StringUtil.isNotEmpty(databasePathToAdd.databaseName)
        && StringUtil.isNotEmpty(databasePathToAdd.schemaName)
      ) {
        if (!this.getDatabaseFromCache(databasePathToAdd)) {
          this.databases$.next([...this.databases$.value, databaseToAdd]);
        }
        this.addAvailableDatabasePath(databasePathToAdd);
      }
    } else {
      console.warn("Null or undefined Database Model Component Path was provided to add, ignoring");
    }
  }

  private removeDatabaseById(databaseIdToRemove: number): void {
    // TODO: Implement real splice from BehaviorSubject
    this.databases$.next([]);
  }

  private addAvailableDatabasePath(databasePathToAdd: DatabasePath): void {
    if (
      databasePathToAdd
      && StringUtil.isNotEmpty(databasePathToAdd.databaseName)
      && StringUtil.isNotEmpty(databasePathToAdd.schemaName)
    ) {
      let databasePathAlreadyLoaded = this.availableDatabasePaths$.value.find((databasePath: DatabasePath) => {
        return databasePath.isEqualTo(databasePathToAdd);
      });
      if (!databasePathAlreadyLoaded) {
        this.availableDatabasePaths$.next([...this.availableDatabasePaths$.value, databasePathToAdd]);
      }
    }
  }

  private addTableCategory(tableCategoryToAdd: DbTableCategory): void {
    if (
      tableCategoryToAdd
      && StringUtil.isNotEmpty(tableCategoryToAdd.name)
    ) {
      let tableModelAlreadyAdded = this.tableCategories$.value.find((tableCategory: DbTableCategory) => {
        return tableCategory.isEqualTo(tableCategoryToAdd);
      });
      if (!tableModelAlreadyAdded) {
        this.tableCategories$.next([...this.tableCategories$.value,tableCategoryToAdd]);
      }
    }
  }

  private addColumnCategory(columnCategoryToAdd: DbColumnCategory): void {
    if (
      columnCategoryToAdd
      && StringUtil.isNotEmpty(columnCategoryToAdd.name)
    ) {
      let columnCategoryAlreadyAdded = this.columnCategories$.value.find((columnCategory: DbColumnCategory) => {
        columnCategory.isEqualTo(columnCategoryToAdd);
      });
      if (!columnCategoryAlreadyAdded) {
        this.columnCategories$.next([...this.columnCategories$.value, columnCategoryToAdd]);
      }
    }
  }

  private createDatabaseApiCall(databaseCreateArgs: DatabaseComponentCreateArgs): Observable<DbModel | undefined> {
    return this.httpClient.post<DbModel>(this.getApiUrl(), databaseCreateArgs)
                          .pipe(
                            map((createDatabaseResult: DbModel) => {
                              return new DbModel().deserialize(createDatabaseResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to create new Database Component due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((database: DbModel | undefined) => {
                              if (database) {
                                this.addDatabase(database);
                              }
                            })
                          );
  }

  private getDatabaseApiCall(databasePath: DatabasePath): Observable<DbModel | undefined> {
    return this.httpClient.get<DbModel>(this.getApiUrlWithAddition(databasePath.databaseName + "/" + databasePath.schemaName))
                          .pipe(
                            map((getDatabaseResult: DbModel) => {
                              return new DbModel().deserialize(getDatabaseResult);
                            }),
                            catchError((error) => {
                              console.log("Failed to create new Database Component due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((database: DbModel | undefined) => {
                              if (database) {
                                this.addDatabase(database);
                              }
                            })
                          );
  }

  private getAllDatabasePathsApiCall(): Observable<DatabasePath[] | undefined> {
    return this.httpClient.get<DatabasePath[]>(this.getApiUrlWithAddition("name"))
                          .pipe(
                            map((getAllDatabasePathsResult: DatabasePath[]) => {
                              let databasePaths: DatabasePath[] = [];
                              getAllDatabasePathsResult.forEach((databasePathResult: DatabasePath) => {
                                let databasePath = new DatabasePath().deserialize(
                                  databasePathResult
                                );
                                databasePaths.push(databasePath);
                              });
                              return databasePaths;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all Database Paths due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((databasePaths: DatabasePath[] | undefined) => {
                              if (databasePaths) {
                                databasePaths.forEach((databasePath: DatabasePath) => {
                                  this.addAvailableDatabasePath(databasePath);
                                });
                              }
                            })
                          );
  }

  private getAllTableCategoriesApiCall(): Observable<DbTableCategory[] | undefined> {
    return this.httpClient.get<DbTableCategory[]>(this.getApiUrlWithAddition("table/category"))
                          .pipe(
                            map((getAllTableCategoriesResult: DbTableCategory[]) => {
                              let tableCategories: DbTableCategory[] = [];
                              getAllTableCategoriesResult.forEach((tableCategoryResult: DbTableCategory) => {
                                let tableCategory = new DbTableCategory().deserialize(
                                  tableCategoryResult
                                );
                                tableCategories.push(tableCategory);
                              });
                              return tableCategories;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all Database Table Categories due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((tableCategories: DbTableCategory[] | undefined) => {
                              if (tableCategories) {
                                tableCategories.forEach((tableCategory: DbTableCategory) => {
                                  this.addTableCategory(tableCategory);
                                });
                              }
                            })
                          );
  }

  private getAllColumnCategoriesApiCall(): Observable<DbColumnCategory[] | undefined> {
    return this.httpClient.get<DbColumnCategory[]>(this.getApiUrlWithAddition("column/category"))
                          .pipe(
                            map((getAllColumnCategoriesResult: DbColumnCategory[]) => {
                              let columnCategories: DbColumnCategory[] = [];
                              getAllColumnCategoriesResult.forEach((columnCategoryResult: DbColumnCategory) => {
                                let columnCategory = new DbColumnCategory().deserialize(
                                  columnCategoryResult
                                );
                                columnCategories.push(columnCategory);
                              });
                              return columnCategories;
                            }),
                            catchError((error) => {
                              console.log("Failed to get all Database Column Categories due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((columnCategories: DbColumnCategory[] | undefined) => {
                              if (columnCategories) {
                                columnCategories.forEach((columnCategory: DbColumnCategory) => {
                                  this.addColumnCategory(columnCategory);
                                });
                              }
                            })
                          );
  }

  private updateColumnApiCall(columnForUpdate: DbColumnModel): Observable<DbColumnModel | undefined> {
    return this.httpClient.post<DbColumnModel>(this.getApiUrlWithAddition("column"), columnForUpdate)
                          .pipe(
                            map((updatedColumnResult: DbColumnModel) => {
                              if (!updatedColumnResult) {
                                throw new Error("Attempted to update Column Component, but received an undefined/null Column Component back from the API");
                              }
                              this.databases$.next([]);
                              return new DbColumnModel().deserialize(updatedColumnResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to update Column Component due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((column: DbColumnModel | undefined) => {
                              if (column) {
                                // Update Database Model
                              }
                            })
                          );
  }

}
