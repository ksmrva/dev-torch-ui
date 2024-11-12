import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { StringUtil } from "../../../entity/helper/string/util/string-util";
import { DbColumnCategory } from "../../../entity/model/database/column/category/db-column-category";
import { DbColumnModel } from "../../../entity/model/database/column/db-column-model";
import { DbModelCreateArgs } from "../../../entity/model/database/create/db-model-create-args";
import { DbModel } from "../../../entity/model/database/db-model";
import { DbModelName } from "../../../entity/model/database/name/db-model-name";
import { DbTableCategory } from "../../../entity/model/database/table/category/db-table-category";
import { DbTableModel } from "../../../entity/model/database/table/db-table-model";
import { DbDataType } from "../../../entity/model/database/type/db-data-type";
import { BaseApiService } from "../../base.api.service";

@Injectable({
  providedIn: "root"
})
export class DbModelService extends BaseApiService {

  private dbModels$: BehaviorSubject<DbModel[]>;

  private availableDbModelNames$: BehaviorSubject<DbModelName[]>;

  private dataTypes$: BehaviorSubject<DbDataType[]>;

  private tableCategories$: BehaviorSubject<DbTableCategory[]>;

  private columnCategories$: BehaviorSubject<DbColumnCategory[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.dbModels$ = new BehaviorSubject<DbModel[]>([]);
    this.availableDbModelNames$ = new BehaviorSubject<DbModelName[]>([]);
    this.dataTypes$ = new BehaviorSubject<DbDataType[]>([]);
    this.tableCategories$ = new BehaviorSubject<DbTableCategory[]>([]);
    this.columnCategories$ = new BehaviorSubject<DbColumnCategory[]>([]);

    this.initDbModelNames();
    this.initDataTypes();
    this.initTableCategories();
    this.initColumnCategories();
  }

  getDbModels(): Observable<DbModel[]> {
    return this.dbModels$.asObservable();
  }

  getAvailableDbModelNames(): Observable<DbModelName[]> {
    return this.availableDbModelNames$.asObservable();
  }

  getDataTypes(): Observable<DbDataType[]> {
    return this.dataTypes$.asObservable();
  }

  getTableCategories(): Observable<DbTableCategory[]> {
    return this.tableCategories$.asObservable();
  }

  getColumnCategories(): Observable<DbColumnCategory[]> {
    return this.columnCategories$.asObservable();
  }

  createDbModel(dbModelCreateArgs: DbModelCreateArgs): Observable<DbModel | undefined> {
    let createDbModelResult: Observable<DbModel | undefined>;
    let dbModelNameToCreate = dbModelCreateArgs.name;
    let dbModelAlreadyCreated = this.availableDbModelNames$.value.find((dbModelName: DbModelName) => {
      return dbModelName.isEqualTo(dbModelNameToCreate);
    });

    if (dbModelAlreadyCreated) {
      console.log("Not attempting to create Database Model with name [" + dbModelCreateArgs.name.databaseName + "." + dbModelCreateArgs.name.schemaName + "] since it was found to already exist");
      createDbModelResult = of(undefined);
    } else {
      createDbModelResult = this.createDbModelApiCall(dbModelCreateArgs);
    }
    return createDbModelResult;
  }

  getDbModel(dbModelNameToGet: DbModelName): Observable<DbModel | undefined> {
    let dbModelResult: Observable<DbModel | undefined>;
    let loadedDbModel = undefined;
    if (this.isDbLoaded(dbModelNameToGet)) {
      loadedDbModel = this.dbModels$.value.find((dbModel: DbModel) => {
        return dbModel.name.isEqualTo(dbModelNameToGet);
      });
    }

    if (loadedDbModel) {
      dbModelResult = of(loadedDbModel);
    } else {
      console.info("Database Model with name [" + dbModelNameToGet.databaseName + "." + dbModelNameToGet.schemaName + "] not found within the Loaded Database Models Map");
      dbModelResult = this.getDbModelApiCall(dbModelNameToGet);
    }
    return dbModelResult;
  }

  updateDbModel(dbModelForUpdate: DbModel): Observable<DbModel | undefined> {
    return of(undefined);
  }

  updateTableModel(tableModelForUpdate: DbTableModel): Observable<DbTableModel | undefined> {
    return of(undefined);
  }

  updateColumnModel(dbColumnModelForUpdate: DbColumnModel): Observable<DbColumnModel | undefined> {
    console.log("Updating DB Column Model");
    return this.updateDbColumnModelApiCall(dbColumnModelForUpdate);
  }

  protected getResourcePathForApiUrl(): string {
    return "/model/db";
  }

  private initDbModelNames(): void {
    this.getAllDbModelNamesApiCall().subscribe({
                                            next: (dbModelNames: DbModelName[] | undefined) => {
                                              if (!dbModelNames) {
                                                throw new Error("Failed to initialize the Database Model Names");
                                              }
                                            },
                                            error: (err: any) => {
                                              throw new Error("Failed to initialize the Database Model Names due to [" + err + "]");
                                            },
                                            complete: () => {
                                              console.log("Finished initializing Database Model Names");
                                            }
                                          });
  }

  private initDataTypes(): void {
    this.getAllDataTypesApiCall().subscribe({
                                    next: (dbDataTypes: DbDataType[] | undefined) => {
                                      if (!dbDataTypes) {
                                        throw new Error("Failed to initialize the Database Data Types");
                                      }
                                    },
                                    error: (err: any) => {
                                      throw new Error("Failed to initialize the Database Data Types due to [" + err + "]");
                                    },
                                    complete: () => {
                                      console.log("Finished initializing Database Data Types");
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

  private isDbLoaded(dbModelNameToCheck: DbModelName): boolean {
    let isDbLoaded = false;
    let loadedDbModelNames = this.dbModels$.value.map((dbModel: DbModel) => {
      return dbModel.name;
    });

    let loadedDbModelName = loadedDbModelNames.find((loadedDbModelName: DbModelName) => {
      return loadedDbModelName.isEqualTo(dbModelNameToCheck);
    });
    if (loadedDbModelName) {
      isDbLoaded = true;
    }
    return isDbLoaded;
  }

  private addDbModel(dbModelToAdd: DbModel): void {
    if (dbModelToAdd) {
      let dbModelNameToAdd = dbModelToAdd.name;
      if (dbModelNameToAdd
        && StringUtil.isNotEmpty(dbModelNameToAdd.databaseName)
        && StringUtil.isNotEmpty(dbModelNameToAdd.schemaName)
      ) {
        if (!this.isDbLoaded(dbModelNameToAdd)) {
          this.dbModels$.next([...this.dbModels$.value, dbModelToAdd]);
        }
        this.addAvailableDbModelName(dbModelNameToAdd);
      }
    } else {
      console.warn("Null or undefined Database Model was provided to add within the Database Model Service, ignoring");
    }
  }

  private removeDbModelById(dbModelIdToRemove: number): void {
    // TODO: Implement real splice from BehaviorSubject
    this.dbModels$.next([]);
  }

  private addAvailableDbModelName(dbModelNameToAdd: DbModelName): void {
    if (
      dbModelNameToAdd
      && StringUtil.isNotEmpty(dbModelNameToAdd.databaseName)
      && StringUtil.isNotEmpty(dbModelNameToAdd.schemaName)
    ) {
      let dbModelNameAlreadyLoaded = this.availableDbModelNames$.value.find((dbModelName: DbModelName) => {
        return dbModelName.isEqualTo(dbModelNameToAdd);
      });
      if (!dbModelNameAlreadyLoaded) {
        this.availableDbModelNames$.next([...this.availableDbModelNames$.value,dbModelNameToAdd]);
      }
    }
  }

  private addDbDataType(dbDataTypeToAdd: DbDataType): void {
    if (
      dbDataTypeToAdd
      && StringUtil.isNotEmpty(dbDataTypeToAdd.name)
    ) {
      let dbDataTypeAlreadyAdded = this.dataTypes$.value.find((dbDataType: DbDataType) => {
        return dbDataType.isEqualTo(dbDataTypeToAdd);
      });
      if (!dbDataTypeAlreadyAdded) {
        this.dataTypes$.next([...this.dataTypes$.value, dbDataTypeToAdd]);
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

  private createDbModelApiCall(dbModelCreateArgs: DbModelCreateArgs): Observable<DbModel | undefined> {
    return this.httpClient.post<DbModel>(this.getApiUrl(), dbModelCreateArgs)
                          .pipe(
                            map((createDbModelResult: DbModel) => {
                              return new DbModel().deserialize(createDbModelResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to create new Database Model due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((dbModel: DbModel | undefined) => {
                              if (dbModel) {
                                this.addDbModel(dbModel);
                              }
                            })
                          );
  }

  private getDbModelApiCall(dbModelName: DbModelName): Observable<DbModel | undefined> {
    return this.httpClient.get<DbModel>(this.getApiUrlWithAddition("/" + dbModelName.databaseName + "/" + dbModelName.schemaName))
                          .pipe(
                            map((getDbModelResult: DbModel) => {
                              return new DbModel().deserialize(getDbModelResult);
                            }),
                            catchError((error) => {
                              console.log("Failed to create new Database Model due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((dbModel: DbModel | undefined) => {
                              if (dbModel) {
                                this.addDbModel(dbModel);
                              }
                            })
                          );
  }

  private getAllDbModelNamesApiCall(): Observable<DbModelName[] | undefined> {
    return this.httpClient.get<DbModelName[]>(this.getApiUrlWithAddition("/name"))
                          .pipe(
                            map((getAllDbModelNamesResult: DbModelName[]) => {
                              let dbModelNames: DbModelName[] = [];
                              getAllDbModelNamesResult.forEach((dbModelNameResult: DbModelName) => {
                                let dbModelName = new DbModelName().deserialize(
                                  dbModelNameResult
                                );
                                dbModelNames.push(dbModelName);
                              });
                              return dbModelNames;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all Database Model Names due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((dbModelNames: DbModelName[] | undefined) => {
                              if (dbModelNames) {
                                dbModelNames.forEach((dbModelName: DbModelName) => {
                                  this.addAvailableDbModelName(dbModelName);
                                });
                              }
                            })
                          );
  }

  private getAllDataTypesApiCall(): Observable<DbDataType[] | undefined> {
    return this.httpClient.get<DbDataType[]>(this.getApiUrlWithAddition("/data/type"))
                          .pipe(
                            map((getAllDbDataTypeResult: DbDataType[]) => {
                              let dbDataTypes: DbDataType[] = [];
                              getAllDbDataTypeResult.forEach((dbDataTypeResult: DbDataType) => {
                                let dbDataType = new DbDataType().deserialize(
                                  dbDataTypeResult
                                );
                                dbDataTypes.push(dbDataType);
                              });
                              return dbDataTypes;
                            }),
                            catchError((error) => {
                              console.log("Failed to get all Database Data Types due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((dbDataTypes: DbDataType[] | undefined) => {
                              if (dbDataTypes) {
                                dbDataTypes.forEach((dbDataType: DbDataType) => {
                                  this.addDbDataType(dbDataType);
                                });
                              }
                            })
                          );
  }

  private getAllTableCategoriesApiCall(): Observable<DbTableCategory[] | undefined> {
    return this.httpClient.get<DbTableCategory[]>(this.getApiUrlWithAddition("/table/category"))
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
    return this.httpClient.get<DbColumnCategory[]>(this.getApiUrlWithAddition("/column/category"))
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

  private updateDbColumnModelApiCall(dbColumnModelForUpdate: DbColumnModel): Observable<DbColumnModel | undefined> {
    return this.httpClient.post<DbColumnModel>(this.getApiUrlWithAddition("/column"), dbColumnModelForUpdate)
                          .pipe(
                            map((updatedDbColumnModelResult: DbColumnModel) => {
                              if (!updatedDbColumnModelResult) {
                                throw new Error("Attempted to update Database Column Model, but received an undefined/null Column Model back from the API");
                              }
                              this.dbModels$.next([]);
                              return new DbColumnModel().deserialize(updatedDbColumnModelResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to update Database Column Model due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((dbColumnModel: DbColumnModel | undefined) => {
                              if (dbColumnModel) {
                                // Update Database Model
                              }
                            })
                          );
  }

}
