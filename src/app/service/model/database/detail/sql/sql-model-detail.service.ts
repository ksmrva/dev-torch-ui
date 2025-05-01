import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { StringUtil } from "../../../../../entity/shared/string/util/string-util";
import { SqlColumnDetail } from "../../../../../entity/model/database/detail/sql/column/sql-column-detail";
import { SqlDatabaseDetailCreateArgs } from "../../../../../entity/model/database/detail/sql/create/sql-database-detail-create-args";
import { SqlDatabaseDetailPath } from "../../../../../entity/model/database/detail/sql/path/sql-database-path";
import { SqlDatabaseDetail } from "../../../../../entity/model/database/detail/sql/sql-database-detail";
import { SqlTableDetail } from "../../../../../entity/model/database/detail/sql/table/sql-table-detail";
import { BaseApiService } from "../../../../shared/base.api.service";

@Injectable({
  providedIn: 'root'
})
export class SqlModelDetailService extends BaseApiService {

  private databaseDetails$: BehaviorSubject<SqlDatabaseDetail[]>;

  private availableDatabaseDetailPaths$: BehaviorSubject<SqlDatabaseDetailPath[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.databaseDetails$ = new BehaviorSubject<SqlDatabaseDetail[]>([]);
    this.availableDatabaseDetailPaths$ = new BehaviorSubject<SqlDatabaseDetailPath[]>([]);

    this.initDatabasePaths();
  }

  override getResourcePathForApiUrl(): string {
    return "/model/db/detail/sql";
  }

  getDatabaseDetails(): Observable<SqlDatabaseDetail[]> {
    return this.databaseDetails$.asObservable();
  }

  getAvailableDatabaseDetailPaths(): Observable<SqlDatabaseDetailPath[]> {
    return this.availableDatabaseDetailPaths$.asObservable();
  }

  createDatabaseDetail(databaseDetailCreateArgs: SqlDatabaseDetailCreateArgs): Observable<SqlDatabaseDetail | undefined> {
    let createDatabaseDetailResult: Observable<SqlDatabaseDetail | undefined>;
    let databaseDetailPath = databaseDetailCreateArgs.path;
    let databaseDetailAlreadyCreated = this.availableDatabaseDetailPaths$.value.find((availableDatabasePath: SqlDatabaseDetailPath) => {
      return availableDatabasePath.isEqualTo(databaseDetailPath);
    });

    if (databaseDetailAlreadyCreated) {
      console.log("Not attempting to create SQL Database Detail with Path [" + databaseDetailCreateArgs.path.getFullPath() + "] since it was found to already exist");
      createDatabaseDetailResult = of(undefined);
    } else {
      createDatabaseDetailResult = this.createDatabaseDetailApiCall(databaseDetailCreateArgs);
    }
    return createDatabaseDetailResult;
  }

  getDatabaseDetail(databaseDetailPathToGet: SqlDatabaseDetailPath): Observable<SqlDatabaseDetail | undefined> {
    let databaseDetailResult: Observable<SqlDatabaseDetail | undefined>;
    let loadedDatabaseDetail = this.getDatabaseDetailFromCache(databaseDetailPathToGet);
    if (loadedDatabaseDetail) {
      databaseDetailResult = of(loadedDatabaseDetail);

    } else {
      console.info("SQL Database Detail with Path [" + databaseDetailPathToGet.getFullPath() + "] not found within the Loaded SQL Database Details Map");
      databaseDetailResult = this.getDatabaseDetailApiCall(databaseDetailPathToGet);

    }
    return databaseDetailResult;
  }

  updateDatabase(databaseForUpdate: SqlDatabaseDetail): Observable<SqlDatabaseDetail | undefined> {
    return of(undefined);
  }

  updateTable(tableForUpdate: SqlTableDetail): Observable<SqlTableDetail | undefined> {
    return of(undefined);
  }

  updateColumn(columnForUpdate: SqlColumnDetail): Observable<SqlColumnDetail | undefined> {
    return this.updateColumnDetailApiCall(columnForUpdate);
  }

  private initDatabasePaths(): void {
    this.getAllDatabaseDetailPathsApiCall().subscribe({
                                            next: (databaseDetailPaths: SqlDatabaseDetailPath[] | undefined) => {
                                              if (!databaseDetailPaths) {
                                                throw new Error("Failed to initialize the SQL Database Detail Paths");
                                              }
                                            },
                                            error: (err: any) => {
                                              throw new Error("Failed to initialize the SQL Database Detail Paths due to [" + err + "]");
                                            },
                                            complete: () => {
                                              console.log("Finished initializing SQL Database Detail Paths");
                                            }
                                          });
  }

  private getDatabaseDetailFromCache(databaseDetailPathToCheck: SqlDatabaseDetailPath): SqlDatabaseDetail | undefined {
    return this.databaseDetails$.value.find((databaseDetail: SqlDatabaseDetail) => {
      return databaseDetail.path.isEqualTo(databaseDetailPathToCheck);
    });
  }

  private addDatabaseDetail(databaseDetailToAdd: SqlDatabaseDetail): void {
    if (databaseDetailToAdd) {
      let databaseDetailPathToAdd = databaseDetailToAdd.path;
      if (databaseDetailPathToAdd
        && StringUtil.isNotEmpty(databaseDetailPathToAdd.databaseName)
        && StringUtil.isNotEmpty(databaseDetailPathToAdd.schemaName)
      ) {
        if (!this.getDatabaseDetailFromCache(databaseDetailPathToAdd)) {
          this.databaseDetails$.next([...this.databaseDetails$.value, databaseDetailToAdd]);
        }
        this.addDatabaseDetailPath(databaseDetailPathToAdd);
      }
    } else {
      console.warn("Null or undefined SQL Database Detail Path was provided to add, ignoring");
    }
  }

  private addDatabaseDetailPath(databaseDetailPathToAdd: SqlDatabaseDetailPath): void {
    if (
      databaseDetailPathToAdd
      && StringUtil.isNotEmpty(databaseDetailPathToAdd.databaseName)
      && StringUtil.isNotEmpty(databaseDetailPathToAdd.schemaName)
    ) {
      let databaseDetailPathAlreadyLoaded = this.availableDatabaseDetailPaths$.value.find((databaseDetailPath: SqlDatabaseDetailPath) => {
        return databaseDetailPath.isEqualTo(databaseDetailPathToAdd);
      });
      if (!databaseDetailPathAlreadyLoaded) {
        this.availableDatabaseDetailPaths$.next([...this.availableDatabaseDetailPaths$.value, databaseDetailPathToAdd]);
      }
    }
  }

  private removeDatabaseDetailById(databaseDetailIdToRemove: number): void {
    // TODO: Implement real splice from BehaviorSubject
    this.databaseDetails$.next([]);
  }

  private createDatabaseDetailApiCall(databaseDetailCreateArgs: SqlDatabaseDetailCreateArgs): Observable<SqlDatabaseDetail | undefined> {
    return this.httpClient.post<SqlDatabaseDetail>(this.getApiUrl(), databaseDetailCreateArgs)
                          .pipe(
                            map((createDatabaseDetailResult: SqlDatabaseDetail) => {
                              return new SqlDatabaseDetail().deserialize(createDatabaseDetailResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to create new SQL Database Detail due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((databaseDetail: SqlDatabaseDetail | undefined) => {
                              if (databaseDetail) {
                                this.addDatabaseDetail(databaseDetail);
                              }
                            })
                          );
  }

  private getDatabaseDetailApiCall(databaseDetailPath: SqlDatabaseDetailPath): Observable<SqlDatabaseDetail | undefined> {
    return this.httpClient.get<SqlDatabaseDetail>(this.getApiUrlWithAddition(databaseDetailPath.databaseName + "/" + databaseDetailPath.schemaName))
                          .pipe(
                            map((getDatabaseDetailResult: SqlDatabaseDetail) => {
                              return new SqlDatabaseDetail().deserialize(getDatabaseDetailResult);
                            }),
                            catchError((error) => {
                              console.log("Failed to create new SQL Database Detail due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((databaseDetail: SqlDatabaseDetail | undefined) => {
                              if (databaseDetail) {
                                this.addDatabaseDetail(databaseDetail);
                              }
                            })
                          );
  }

  private getAllDatabaseDetailPathsApiCall(): Observable<SqlDatabaseDetailPath[] | undefined> {
    return this.httpClient.get<SqlDatabaseDetailPath[]>(this.getApiUrlWithAddition("path"))
                          .pipe(
                            map((getAllDatabaseDetailPathsResult: SqlDatabaseDetailPath[]) => {
                              let databaseDetailPaths: SqlDatabaseDetailPath[] = [];
                              getAllDatabaseDetailPathsResult.forEach((databaseDetailPathResult: SqlDatabaseDetailPath) => {
                                let databaseDetailPath = new SqlDatabaseDetailPath().deserialize(databaseDetailPathResult);
                                databaseDetailPaths.push(databaseDetailPath);
                              });
                              return databaseDetailPaths;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all SQL Database Detail Paths due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((databaseDetailPaths: SqlDatabaseDetailPath[] | undefined) => {
                              if (databaseDetailPaths) {
                                databaseDetailPaths.forEach((databaseDetailPath: SqlDatabaseDetailPath) => {
                                  this.addDatabaseDetailPath(databaseDetailPath);
                                });
                              }
                            })
                          );
  }

  private updateColumnDetailApiCall(columnDetailForUpdate: SqlColumnDetail): Observable<SqlColumnDetail | undefined> {
    return this.httpClient.post<SqlColumnDetail>(this.getApiUrlWithAddition("column"), columnDetailForUpdate)
                          .pipe(
                            map((updatedColumnDetailResult: SqlColumnDetail) => {
                              if (!updatedColumnDetailResult) {
                                throw new Error("Attempted to update SQL Column Detail, but received an undefined/null SQL Column Detail back from the API");
                              }
                              // this.databaseDetails$.next([]);
                              return new SqlColumnDetail().deserialize(updatedColumnDetailResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to update SQL Column Detail due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((columnDetail: SqlColumnDetail | undefined) => {
                              if (columnDetail) {
                                // Update Database Details to include new Column created
                              }
                            })
                          );
  }

}
