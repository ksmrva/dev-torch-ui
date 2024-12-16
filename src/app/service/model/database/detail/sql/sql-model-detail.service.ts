import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { StringUtil } from "../../../../../entity/misc/string/util/string-util";
import { SqlColumnDetail } from "../../../../../entity/model/database/detail/sql/column/sql-column-detail";
import { SqlDatabaseDetailCreateArgs } from "../../../../../entity/model/database/detail/sql/create/sql-database-detail-create-args";
import { SqlDatabaseDetailPath } from "../../../../../entity/model/database/detail/sql/path/sql-database-path";
import { SqlDatabaseDetail } from "../../../../../entity/model/database/detail/sql/sql-database-detail";
import { SqlTableDetail } from "../../../../../entity/model/database/detail/sql/table/sql-table-detail";
import { BaseApiService } from "../../../../base.api.service";

@Injectable({
  providedIn: 'root'
})
export class SqlModelDetailService extends BaseApiService {

  private databases$: BehaviorSubject<SqlDatabaseDetail[]>;

  private availableDatabasePaths$: BehaviorSubject<SqlDatabaseDetailPath[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.databases$ = new BehaviorSubject<SqlDatabaseDetail[]>([]);
    this.availableDatabasePaths$ = new BehaviorSubject<SqlDatabaseDetailPath[]>([]);

    this.initDatabasePaths();
  }

  override getResourcePathForApiUrl(): string {
    return "/model/db/detail/sql";
  }

  getDatabases(): Observable<SqlDatabaseDetail[]> {
    return this.databases$.asObservable();
  }

  getAvailableDatabasePaths(): Observable<SqlDatabaseDetailPath[]> {
    return this.availableDatabasePaths$.asObservable();
  }

  createDatabase(databaseCreateArgs: SqlDatabaseDetailCreateArgs): Observable<SqlDatabaseDetail | undefined> {
    let createDatabaseResult: Observable<SqlDatabaseDetail | undefined>;
    let databasePath = databaseCreateArgs.path;
    let databaseAlreadyCreated = this.availableDatabasePaths$.value.find((availableDatabasePath: SqlDatabaseDetailPath) => {
      return availableDatabasePath.isEqualTo(databasePath);
    });

    if (databaseAlreadyCreated) {
      console.log("Not attempting to create SQL Database Detail with Path [" + databaseCreateArgs.path.getFullPath() + "] since it was found to already exist");
      createDatabaseResult = of(undefined);
    } else {
      createDatabaseResult = this.createDatabaseApiCall(databaseCreateArgs);
    }
    return createDatabaseResult;
  }

  getDatabase(databasePathToGet: SqlDatabaseDetailPath): Observable<SqlDatabaseDetail | undefined> {
    let databaseResult: Observable<SqlDatabaseDetail | undefined>;
    let loadedDatabase = this.getDatabaseFromCache(databasePathToGet);
    if (loadedDatabase) {
      databaseResult = of(loadedDatabase);

    } else {
      console.info("SQL Database Detail with Path [" + databasePathToGet.getFullPath() + "] not found within the Loaded SQL Database Details Map");
      databaseResult = this.getDatabaseApiCall(databasePathToGet);

    }
    return databaseResult;
  }

  updateDatabase(databaseForUpdate: SqlDatabaseDetail): Observable<SqlDatabaseDetail | undefined> {
    return of(undefined);
  }

  updateTable(tableForUpdate: SqlTableDetail): Observable<SqlTableDetail | undefined> {
    return of(undefined);
  }

  updateColumn(columnForUpdate: SqlColumnDetail): Observable<SqlColumnDetail | undefined> {
    return this.updateColumnApiCall(columnForUpdate);
  }

  private initDatabasePaths(): void {
    this.getAllDatabasePathsApiCall().subscribe({
                                            next: (databasePaths: SqlDatabaseDetailPath[] | undefined) => {
                                              if (!databasePaths) {
                                                throw new Error("Failed to initialize the SQL Database Model Detail Paths");
                                              }
                                            },
                                            error: (err: any) => {
                                              throw new Error("Failed to initialize the SQL Database Model Detail Paths due to [" + err + "]");
                                            },
                                            complete: () => {
                                              console.log("Finished initializing SQL Database Model Detail Paths");
                                            }
                                          });
  }

  private getDatabaseFromCache(databasePathToCheck: SqlDatabaseDetailPath): SqlDatabaseDetail | undefined {
    return this.databases$.value.find((database: SqlDatabaseDetail) => {
      return database.name.isEqualTo(databasePathToCheck);
    });
  }

  private addDatabase(databaseToAdd: SqlDatabaseDetail): void {
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
      console.warn("Null or undefined SQL Database Model Detail Path was provided to add, ignoring");
    }
  }

  private addAvailableDatabasePath(databasePathToAdd: SqlDatabaseDetailPath): void {
    if (
      databasePathToAdd
      && StringUtil.isNotEmpty(databasePathToAdd.databaseName)
      && StringUtil.isNotEmpty(databasePathToAdd.schemaName)
    ) {
      let databasePathAlreadyLoaded = this.availableDatabasePaths$.value.find((databasePath: SqlDatabaseDetailPath) => {
        return databasePath.isEqualTo(databasePathToAdd);
      });
      if (!databasePathAlreadyLoaded) {
        this.availableDatabasePaths$.next([...this.availableDatabasePaths$.value, databasePathToAdd]);
      }
    }
  }

  private removeDatabaseById(databaseIdToRemove: number): void {
    // TODO: Implement real splice from BehaviorSubject
    this.databases$.next([]);
  }

  private createDatabaseApiCall(databaseCreateArgs: SqlDatabaseDetailCreateArgs): Observable<SqlDatabaseDetail | undefined> {
    return this.httpClient.post<SqlDatabaseDetail>(this.getApiUrl(), databaseCreateArgs)
                          .pipe(
                            map((createDatabaseResult: SqlDatabaseDetail) => {
                              return new SqlDatabaseDetail().deserialize(createDatabaseResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to create new SQL Database Detail due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((database: SqlDatabaseDetail | undefined) => {
                              if (database) {
                                this.addDatabase(database);
                              }
                            })
                          );
  }

  private getDatabaseApiCall(databasePath: SqlDatabaseDetailPath): Observable<SqlDatabaseDetail | undefined> {
    return this.httpClient.get<SqlDatabaseDetail>(this.getApiUrlWithAddition(databasePath.databaseName + "/" + databasePath.schemaName))
                          .pipe(
                            map((getDatabaseResult: SqlDatabaseDetail) => {
                              return new SqlDatabaseDetail().deserialize(getDatabaseResult);
                            }),
                            catchError((error) => {
                              console.log("Failed to create new SQL Database Detail due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((database: SqlDatabaseDetail | undefined) => {
                              if (database) {
                                this.addDatabase(database);
                              }
                            })
                          );
  }

  private getAllDatabasePathsApiCall(): Observable<SqlDatabaseDetailPath[] | undefined> {
    return this.httpClient.get<SqlDatabaseDetailPath[]>(this.getApiUrlWithAddition("path"))
                          .pipe(
                            map((getAllDatabasePathsResult: SqlDatabaseDetailPath[]) => {
                              let databasePaths: SqlDatabaseDetailPath[] = [];
                              getAllDatabasePathsResult.forEach((databasePathResult: SqlDatabaseDetailPath) => {
                                let databasePath = new SqlDatabaseDetailPath().deserialize(
                                  databasePathResult
                                );
                                databasePaths.push(databasePath);
                              });
                              return databasePaths;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all SQL Database Detail Paths due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((databasePaths: SqlDatabaseDetailPath[] | undefined) => {
                              if (databasePaths) {
                                databasePaths.forEach((databasePath: SqlDatabaseDetailPath) => {
                                  this.addAvailableDatabasePath(databasePath);
                                });
                              }
                            })
                          );
  }

  private updateColumnApiCall(columnForUpdate: SqlColumnDetail): Observable<SqlColumnDetail | undefined> {
    return this.httpClient.post<SqlColumnDetail>(this.getApiUrlWithAddition("column"), columnForUpdate)
                          .pipe(
                            map((updatedColumnResult: SqlColumnDetail) => {
                              if (!updatedColumnResult) {
                                throw new Error("Attempted to update SQL Column Detail, but received an undefined/null SQL Column Detail back from the API");
                              }
                              this.databases$.next([]);
                              return new SqlColumnDetail().deserialize(updatedColumnResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to update SQL Column Detail due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((column: SqlColumnDetail | undefined) => {
                              if (column) {
                                // Update Database Model
                              }
                            })
                          );
  }

}
