import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { StringUtil } from "../../../../entity/shared/string/util/string-util";
import { DbFieldCategory } from "../../../../entity/model/database/detail/category/field/db-field-category";
import { DbCollectionCategory } from "../../../../entity/model/database/detail/category/collection/db-collection-category";
import { BaseApiService } from "../../../shared/base.api.service";

@Injectable({
  providedIn: "root"
})
export class DatabaseModelDetailService extends BaseApiService {

  private collectionCategories$: BehaviorSubject<DbCollectionCategory[]>;

  private fieldCategories$: BehaviorSubject<DbFieldCategory[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.collectionCategories$ = new BehaviorSubject<DbCollectionCategory[]>([]);
    this.fieldCategories$ = new BehaviorSubject<DbFieldCategory[]>([]);

    this.initCollectionCategories();
    this.initFieldCategories();
  }

  override getResourcePathForApiUrl(): string {
    return "/model/db/detail";
  }

  getCollectionCategories(): Observable<DbCollectionCategory[]> {
    return this.collectionCategories$.asObservable();
  }

  getFieldCategories(): Observable<DbFieldCategory[]> {
    return this.fieldCategories$.asObservable();
  }

  private initCollectionCategories(): void {
    this.getAllCollectionCategoriesApiCall().subscribe({
                                          next: (collectionCategories: DbCollectionCategory[] | undefined) => {
                                            if (!collectionCategories) {
                                              throw new Error("Failed to initialize the Database Collection Categories");
                                            }
                                          },
                                          error: (err: any) => {
                                            throw new Error("Failed to initialize the Database Collection Categories due to [" + err + "]");
                                          },
                                          complete: () => {
                                            console.log("Finished initializing Database Collection Categories");
                                          }
                                        });
  }

  private initFieldCategories(): void {
    this.getAllFieldCategoriesApiCall().subscribe({
                                          next: (fieldCategories: DbFieldCategory[] | undefined) => {
                                            if (!fieldCategories) {
                                              throw new Error("Failed to initialize the Database Field Categories");
                                            }
                                          },
                                          error: (err: any) => {
                                            throw new Error("Failed to initialize the Database Field Categories due to [" + err + "]");
                                          },
                                          complete: () => {
                                            console.log("Finished initializing Database Field Categories");
                                          }
                                        });
  }

  private addCollectionCategory(collectionCategoryToAdd: DbCollectionCategory): void {
    if (
      collectionCategoryToAdd
      && StringUtil.isNotEmpty(collectionCategoryToAdd.name)
    ) {
      let collectionCategoryAlreadyAdded = this.collectionCategories$.value.find((collectionCategory: DbCollectionCategory) => {
        return collectionCategory.isEqualTo(collectionCategoryToAdd);
      });
      if (!collectionCategoryAlreadyAdded) {
        this.collectionCategories$.next([...this.collectionCategories$.value,collectionCategoryToAdd]);
      }
    }
  }

  private addFieldCategory(fieldCategoryToAdd: DbFieldCategory): void {
    if (
      fieldCategoryToAdd
      && StringUtil.isNotEmpty(fieldCategoryToAdd.name)
    ) {
      let fieldCategoryAlreadyAdded = this.fieldCategories$.value.find((fieldCategory: DbFieldCategory) => {
        fieldCategory.isEqualTo(fieldCategoryToAdd);
      });
      if (!fieldCategoryAlreadyAdded) {
        this.fieldCategories$.next([...this.fieldCategories$.value, fieldCategoryToAdd]);
      }
    }
  }

  private getAllCollectionCategoriesApiCall(): Observable<DbCollectionCategory[] | undefined> {
    return this.httpClient.get<DbCollectionCategory[]>(this.getApiUrlWithAddition("category/collection"))
                          .pipe(
                            map((getAllCollectionCategoriesResult: DbCollectionCategory[]) => {
                              let collectionCategories: DbCollectionCategory[] = [];
                              getAllCollectionCategoriesResult.forEach((collectionCategoryResult: DbCollectionCategory) => {
                                let collectionCategory = new DbCollectionCategory().deserialize(
                                  collectionCategoryResult
                                );
                                collectionCategories.push(collectionCategory);
                              });
                              return collectionCategories;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all Database Collection Categories due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((collectionCategories: DbCollectionCategory[] | undefined) => {
                              if (collectionCategories) {
                                collectionCategories.forEach((collectionCategory: DbCollectionCategory) => {
                                  this.addCollectionCategory(collectionCategory);
                                });
                              }
                            })
                          );
  }

  private getAllFieldCategoriesApiCall(): Observable<DbFieldCategory[] | undefined> {
    return this.httpClient.get<DbFieldCategory[]>(this.getApiUrlWithAddition("category/field"))
                          .pipe(
                            map((getAllFieldCategoriesResult: DbFieldCategory[]) => {
                              let fieldCategories: DbFieldCategory[] = [];
                              getAllFieldCategoriesResult.forEach((fieldCategoryResult: DbFieldCategory) => {
                                let fieldCategory = new DbFieldCategory().deserialize(
                                  fieldCategoryResult
                                );
                                fieldCategories.push(fieldCategory);
                              });
                              return fieldCategories;
                            }),
                            catchError((error) => {
                              console.log("Failed to get all Database Field Categories due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((fieldCategories: DbFieldCategory[] | undefined) => {
                              if (fieldCategories) {
                                fieldCategories.forEach((fieldCategory: DbFieldCategory) => {
                                  this.addFieldCategory(fieldCategory);
                                });
                              }
                            })
                          );
  }

}
