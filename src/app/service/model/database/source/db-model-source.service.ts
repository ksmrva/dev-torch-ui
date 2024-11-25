import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { DbModelSourceConfig } from "../../../../entity/model/database/source/config/db-model-source-config";
import { DbModelSourceUrl } from "../../../../entity/model/database/source/url/db-model-source-url";
import { BaseApiService } from "../../../base.api.service";
import { DbModelSourcePreset } from "../../../../entity/model/database/source/preset/db-model-source-preset";
import { DbModelSourceSupportedDriver } from "../../../../entity/model/database/source/driver/db-model-source-supported-driver";
import { DbModelSourceUrlSupportedProvider } from "../../../../entity/model/database/source/url/provider/db-model-source-url-supported-provider";
import { DbModelSourceUrlSupportedScheme } from "../../../../entity/model/database/source/url/scheme/db-model-source-url-supported-scheme";

@Injectable({
  providedIn: 'root'
})
export class DbModelSourceService extends BaseApiService {

  private sourceUrls$: BehaviorSubject<DbModelSourceUrl[]>;

  private sourceConfigs$: BehaviorSubject<DbModelSourceConfig[]>;

  private sourcePresets$: BehaviorSubject<DbModelSourcePreset[]>;

  private sourceSupportedDrivers$: BehaviorSubject<DbModelSourceSupportedDriver[]>;

  private sourceUrlSupportedSchemes$: BehaviorSubject<DbModelSourceUrlSupportedScheme[]>;

  private sourceUrlSupportedProviders$: BehaviorSubject<DbModelSourceUrlSupportedProvider[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.sourceUrls$ = new BehaviorSubject<DbModelSourceUrl[]>([]);
    this.sourceConfigs$ = new BehaviorSubject<DbModelSourceConfig[]>([]);
    this.sourcePresets$ = new BehaviorSubject<DbModelSourcePreset[]>([]);
    this.sourceSupportedDrivers$ = new BehaviorSubject<DbModelSourceSupportedDriver[]>([]);
    this.sourceUrlSupportedSchemes$ = new BehaviorSubject<DbModelSourceUrlSupportedScheme[]>([]);
    this.sourceUrlSupportedProviders$ = new BehaviorSubject<DbModelSourceUrlSupportedProvider[]>([]);

    this.initSourceUrls();
    this.initSourceConfigs();
    this.initSourcePresets();
    this.initSourceSupportedDrivers();
    this.initSourceUrlSupportedSchemes();
    this.initSourceUrlSupportedProviders();
  }

  getSourceUrls(): Observable<DbModelSourceUrl[]> {
    return this.sourceUrls$.asObservable();
  }

  getSourceConfigs(): Observable<DbModelSourceConfig[]> {
    return this.sourceConfigs$.asObservable();
  }

  getSourcePresets(): Observable<DbModelSourcePreset[]> {
    return this.sourcePresets$.asObservable();
  }

  getSourceSupportedDrivers(): Observable<DbModelSourceSupportedDriver[]> {
    return this.sourceSupportedDrivers$.asObservable();
  }

  getSourceUrlSupportedSchemes(): Observable<DbModelSourceUrlSupportedScheme[]> {
    return this.sourceUrlSupportedSchemes$.asObservable();
  }

  getSourceUrlSupportedProviders(): Observable<DbModelSourceUrlSupportedProvider[]> {
    return this.sourceUrlSupportedProviders$.asObservable();
  }

  createSourceUrl( sourceUrlToCreate: DbModelSourceUrl ): Observable<DbModelSourceUrl | undefined> {
    let createSourceUrlResult: Observable<DbModelSourceUrl | undefined>;
    let sourceUrlAlreadyCreated = this.sourceUrls$.value.find((sourceUrl: DbModelSourceUrl) => {
      return sourceUrl.isEqualTo(sourceUrlToCreate);
    });

    if (sourceUrlAlreadyCreated) {
      console.log( "Not attempting to create Database Model Source URL since it was found to already exist" );
      createSourceUrlResult = of(undefined);
    } else {
      createSourceUrlResult = this.createSourceUrlApiCall( sourceUrlToCreate );
    }
    return createSourceUrlResult;
  }

  createDbModelConfig( sourceConfigToCreate: DbModelSourceConfig ): Observable<DbModelSourceConfig | undefined> {
    let createSourceConfigResult: Observable<DbModelSourceConfig | undefined>;
    let sourceConfigAlreadyCreated = this.sourceConfigs$.value.find((sourceConfig: DbModelSourceConfig) => {
      return sourceConfig.isEqualTo(sourceConfigToCreate);
    });

    if (sourceConfigAlreadyCreated) {
      console.log( "Not attempting to create Database Model Source Config since it was found to already exist" );
      createSourceConfigResult = of(undefined);
    } else {
      createSourceConfigResult = this.createSourceConfigApiCall(
        sourceConfigToCreate
      );
    }
    return createSourceConfigResult;
  }

  protected override getResourcePathForApiUrl(): string {
    return "/model/db/source";
  }

  private initSourceUrls(): void {
    this.getAllSourceUrlsApiCall().subscribe({
                                        next: (sourceUrls: DbModelSourceUrl[] | undefined) => {
                                          if (!sourceUrls) {
                                            throw new Error("Failed to initialize the Database Model Source URLs");
                                          }
                                        },
                                        error: (err: any) => {
                                          throw new Error( "Failed to initialize the Database Model Source URLs due to [" + err + "]" );
                                        },
                                        complete: () => {
                                          console.log("Finished initializing Database Model Source URLs");
                                        }
                                      });
  }

  private initSourceConfigs(): void {
    this.getAllSourceConfigsApiCall().subscribe({
                                          next: (sourceConfigs: DbModelSourceConfig[] | undefined) => {
                                            if (!sourceConfigs) {
                                              throw new Error("Failed to initialize the Database Model Source Configs");
                                            }
                                          },
                                          error: (err: any) => {
                                            throw new Error( "Failed to initialize the Database Model Source Configs due to [" + err + "]" );
                                          },
                                          complete: () => {
                                            console.log("Finished initializing Database Model Source Configs");
                                          }
                                        });
  }

  private initSourcePresets(): void {
    this.getAllSourcePresetsApiCall().subscribe({
                                          next: (sourcePresets: DbModelSourcePreset[] | undefined) => {
                                            if (!sourcePresets) {
                                              throw new Error("Failed to initialize the Database Model Source Presets");
                                            }
                                          },
                                          error: (err: any) => {
                                            throw new Error( "Failed to initialize the Database Model Source Presets due to [" + err + "]" );
                                          },
                                          complete: () => {
                                            console.log("Finished initializing Database Model Source Presets");
                                          }
                                        });
  }


  private initSourceSupportedDrivers(): void {
    this.getAllSourceSupportedDriversApiCall().subscribe({
                                                    next: (sourceSupportedDrivers: DbModelSourceSupportedDriver[] | undefined) => {
                                                      if (!sourceSupportedDrivers) {
                                                        throw new Error("Failed to initialize the Database Model Source Supported Drivers");
                                                      }
                                                    },
                                                    error: (err: any) => {
                                                      throw new Error( "Failed to initialize the Database Model Source Supported Drivers due to [" + err + "]" );
                                                    },
                                                    complete: () => {
                                                      console.log("Finished initializing Database Model Source Supported Drivers");
                                                    }
                                                  });
  }

  private initSourceUrlSupportedSchemes(): void {
    this.getAllSourceUrlSupportedSchemesApiCall().subscribe({
                                                      next: (sourceUrlSupportedSchemes: DbModelSourceUrlSupportedScheme[] | undefined) => {
                                                        if (!sourceUrlSupportedSchemes) {
                                                          throw new Error("Failed to initialize the Database Model Source URL Supported Schemes");
                                                        }
                                                      },
                                                      error: (err: any) => {
                                                        throw new Error( "Failed to initialize the Database Model Source URL Supported Schemes due to [" + err + "]" );
                                                      },
                                                      complete: () => {
                                                        console.log("Finished initializing Database Model Source URL Supported Schemes");
                                                      }
                                                    });
  }

  private initSourceUrlSupportedProviders(): void {
    this.getAllSourceUrlSupportedProvidersApiCall().subscribe({
                                                        next: (sourceUrlSupportedProviders: DbModelSourceUrlSupportedProvider[] | undefined) => {
                                                          if (!sourceUrlSupportedProviders) {
                                                            throw new Error("Failed to initialize the Database Model Source URL Supported Providers");
                                                          }
                                                        },
                                                        error: (err: any) => {
                                                          throw new Error( "Failed to initialize the Database Model Source URL Supported Providers due to [" + err + "]" );
                                                        },
                                                        complete: () => {
                                                          console.log("Finished initializing Database Model Source URL Supported Providers");
                                                        }
                                                      });
  }

  private addSourceUrl(sourceUrlToAdd: DbModelSourceUrl): void {
    if (
      sourceUrlToAdd
      && sourceUrlToAdd.id !== null
      && sourceUrlToAdd.id !== undefined
    ) {
      let sourceUrlAlreadyAdded = this.sourceUrls$.value.find((sourceUrl: DbModelSourceUrl) => {
        return sourceUrl.isEqualTo(sourceUrlToAdd);
      });
      if (!sourceUrlAlreadyAdded) {
        this.sourceUrls$.next([ ...this.sourceUrls$.value, sourceUrlToAdd ]);
      }
    }
  }

  private addSourceConfig(sourceConfigToAdd: DbModelSourceConfig): void {
    if (
      sourceConfigToAdd
      && sourceConfigToAdd.id !== null
      && sourceConfigToAdd.id !== undefined
    ) {
      let sourceConfigAlreadyAdded = this.sourceConfigs$.value.find((sourceConfig: DbModelSourceConfig) => {
        return sourceConfig.isEqualTo(sourceConfigToAdd);
      });
      if (!sourceConfigAlreadyAdded) {
        this.sourceConfigs$.next([ ...this.sourceConfigs$.value, sourceConfigToAdd ]);
      }
    }
  }

  private addSourcePreset(sourcePresetToAdd: DbModelSourcePreset): void {
    if (
      sourcePresetToAdd
      && sourcePresetToAdd.id !== null
      && sourcePresetToAdd.id !== undefined
    ) {
      let sourcePresetAlreadyAdded = this.sourcePresets$.value.find((sourcePreset: DbModelSourcePreset) => {
        return sourcePreset.isEqualTo(sourcePresetToAdd);
      });
      if (!sourcePresetAlreadyAdded) {
        this.sourcePresets$.next([ ...this.sourcePresets$.value, sourcePresetToAdd ]);
      }
    }
  }

  private addSourceSupportedDriver(sourceSupportedDriverToAdd: DbModelSourceSupportedDriver): void {
    if (
      sourceSupportedDriverToAdd
      && sourceSupportedDriverToAdd.id !== null
      && sourceSupportedDriverToAdd.id !== undefined
    ) {
      let sourceSupportedDriverAlreadyAdded = this.sourceSupportedDrivers$.value.find((sourceSupportedDriver: DbModelSourceSupportedDriver) => {
        return sourceSupportedDriver.isEqualTo(sourceSupportedDriverToAdd);
      });
      if (!sourceSupportedDriverAlreadyAdded) {
        this.sourceSupportedDrivers$.next([ ...this.sourceSupportedDrivers$.value, sourceSupportedDriverToAdd ]);
      }
    }
  }

  private addSourceUrlSupportedScheme(sourceUrlSupportedSchemeToAdd: DbModelSourceUrlSupportedScheme): void {
    if (
      sourceUrlSupportedSchemeToAdd
      && sourceUrlSupportedSchemeToAdd.id !== null
      && sourceUrlSupportedSchemeToAdd.id !== undefined
    ) {
      let sourceUrlSupportedSchemeAlreadyAdded = this.sourceUrlSupportedSchemes$.value.find((sourceUrlSupportedScheme: DbModelSourceUrlSupportedScheme) => {
        return sourceUrlSupportedScheme.isEqualTo(sourceUrlSupportedSchemeToAdd);
      });
      if (!sourceUrlSupportedSchemeAlreadyAdded) {
        this.sourceUrlSupportedSchemes$.next([ ...this.sourceUrlSupportedSchemes$.value, sourceUrlSupportedSchemeToAdd ]);
      }
    }
  }

  private addSourceUrlSupportedProvider(sourceUrlSupportedProviderToAdd: DbModelSourceUrlSupportedProvider): void {
    if (
      sourceUrlSupportedProviderToAdd
      && sourceUrlSupportedProviderToAdd.id !== null
      && sourceUrlSupportedProviderToAdd.id !== undefined
    ) {
      let sourceUrlSupportedProviderAlreadyAdded = this.sourceUrlSupportedProviders$.value.find((sourceUrlSupportedProvider: DbModelSourceUrlSupportedProvider) => {
        return sourceUrlSupportedProvider.isEqualTo(sourceUrlSupportedProviderToAdd);
      });
      if (!sourceUrlSupportedProviderAlreadyAdded) {
        this.sourceUrlSupportedProviders$.next([ ...this.sourceUrlSupportedProviders$.value, sourceUrlSupportedProviderToAdd ]);
      }
    }
  }

  private createSourceUrlApiCall( sourceUrl: DbModelSourceUrl ): Observable<DbModelSourceUrl | undefined> {
    return this.httpClient.post<DbModelSourceUrl>(this.getApiUrlWithAddition("url"), sourceUrl)
                          .pipe(
                            map((createSourceUrlResult: DbModelSourceUrl) => {
                              return new DbModelSourceUrl().deserialize(createSourceUrlResult);
                            }),
                            catchError((error: any) => {
                              console.log( "Failed to create new Database Model Source URL due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((sourceUrl: DbModelSourceUrl | undefined) => {
                              if (sourceUrl) {
                                this.addSourceUrl(sourceUrl);
                              }
                            })
                          );
  }

  private createSourceConfigApiCall( sourceConfig: DbModelSourceConfig ): Observable<DbModelSourceConfig | undefined> {
    return this.httpClient.post<DbModelSourceConfig>(this.getApiUrl(), sourceConfig)
                                                      .pipe(
                                                        map((createSourceConfigResult: DbModelSourceConfig) => {
                                                          return new DbModelSourceConfig().deserialize( createSourceConfigResult );
                                                        }),
                                                        catchError((error) => {
                                                          console.log( "Failed to create new Database Model Source Config due to [" + error + "]", error );
                                                          return of(undefined);
                                                        })
                                                      )
                                                      .pipe(
                                                        tap((sourceConfig: DbModelSourceConfig | undefined) => {
                                                          if (sourceConfig) {
                                                            this.addSourceConfig(sourceConfig);
                                                          }
                                                        })
                                                      );
  }

  private getAllSourceUrlsApiCall(): Observable< DbModelSourceUrl[] | undefined > {
    return this.httpClient.get<DbModelSourceUrl[]>(this.getApiUrlWithAddition("url"))
                          .pipe(
                            map((getAllSourceUrlsResult: DbModelSourceUrl[]) => {
                              let sourceUrls: DbModelSourceUrl[] = [];
                              getAllSourceUrlsResult.forEach((sourceUrlResult: DbModelSourceUrl) => {
                                let sourceUrl = new DbModelSourceUrl().deserialize( sourceUrlResult );
                                sourceUrls.push(sourceUrl);
                              });
                              return sourceUrls;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source URLs due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((sourceUrls: DbModelSourceUrl[] | undefined) => {
                              if (sourceUrls) {
                                sourceUrls.forEach((sourceUrl: DbModelSourceUrl) => {
                                  this.addSourceUrl(sourceUrl);
                                });
                              }
                            })
                          );
  }

  private getAllSourceConfigsApiCall(): Observable< DbModelSourceConfig[] | undefined > {
    return this.httpClient.get<DbModelSourceConfig[]>(this.getApiUrl())
                          .pipe(
                            map((getAllSourceConfigsResult: DbModelSourceConfig[]) => {
                              let sourceConfigs: DbModelSourceConfig[] = [];
                              getAllSourceConfigsResult.forEach((sourceConfigResult: DbModelSourceConfig) => {
                                let sourceConfig = new DbModelSourceConfig().deserialize( sourceConfigResult );
                                sourceConfigs.push(sourceConfig);
                              });
                              return sourceConfigs;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source Configs due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((sourceConfigs: DbModelSourceConfig[] | undefined) => {
                              if (sourceConfigs) {
                                sourceConfigs.forEach((sourceConfig: DbModelSourceConfig) => {
                                  this.addSourceConfig(sourceConfig);
                                });
                              }
                            })
                          );
  }

  private getAllSourcePresetsApiCall(): Observable< DbModelSourcePreset[] | undefined > {
    return this.httpClient.get<DbModelSourcePreset[]>(this.getApiUrlWithAddition("preset"))
                          .pipe(
                            map((getAllSourcePresetsResult: DbModelSourcePreset[]) => {
                              let sourcePresets: DbModelSourcePreset[] = [];
                              getAllSourcePresetsResult.forEach((sourcePresetResult: DbModelSourcePreset) => {
                                let sourcePreset = new DbModelSourcePreset().deserialize( sourcePresetResult );
                                sourcePresets.push(sourcePreset);
                              });
                              return sourcePresets;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source Presets due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((sourcePresets: DbModelSourcePreset[] | undefined) => {
                              if (sourcePresets) {
                                sourcePresets.forEach((sourcePreset: DbModelSourcePreset) => {
                                  this.addSourcePreset(sourcePreset);
                                });
                              }
                            })
                          );
  }

  private getAllSourceSupportedDriversApiCall(): Observable< DbModelSourceSupportedDriver[] | undefined > {
    return this.httpClient.get<DbModelSourceSupportedDriver[]>(this.getApiUrlWithAddition("driver"))
                          .pipe(
                            map((getAllSourceSupportedDriversResult: DbModelSourceSupportedDriver[]) => {
                              let sourceSupportedDrivers: DbModelSourceSupportedDriver[] = [];
                              getAllSourceSupportedDriversResult.forEach((sourceSupportedDriverResult: DbModelSourceSupportedDriver) => {
                                let sourceSupportedDriver = new DbModelSourceSupportedDriver().deserialize(
                                  sourceSupportedDriverResult
                                );
                                sourceSupportedDrivers.push(sourceSupportedDriver);
                              });
                              return sourceSupportedDrivers;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source Supported Drivers due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((sourceSupportedDriver: DbModelSourceSupportedDriver[] | undefined) => {
                              if (sourceSupportedDriver) {
                                sourceSupportedDriver.forEach((sourceSupportedDriver: DbModelSourceSupportedDriver) => {
                                  this.addSourceSupportedDriver(sourceSupportedDriver);
                                });
                              }
                            })
                          );
  }

  private getAllSourceUrlSupportedSchemesApiCall(): Observable< DbModelSourceUrlSupportedScheme[] | undefined > {
    return this.httpClient.get<DbModelSourceUrlSupportedScheme[]>(this.getApiUrlWithAddition("url/scheme"))
                          .pipe(
                            map((getAllSourceUrlSupportedSchemesResult: DbModelSourceUrlSupportedScheme[]) => {
                              let sourceUrlSupportedSchemes: DbModelSourceUrlSupportedScheme[] = [];
                              getAllSourceUrlSupportedSchemesResult.forEach((sourceUrlSupportedSchemeResult: DbModelSourceUrlSupportedScheme) => {
                                let sourceUrlSupportedScheme = new DbModelSourceUrlSupportedScheme().deserialize(
                                  sourceUrlSupportedSchemeResult
                                );
                                sourceUrlSupportedSchemes.push(sourceUrlSupportedScheme);
                              });
                              return sourceUrlSupportedSchemes;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source URL Supported Schemes due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((sourceUrlSupportedScheme: DbModelSourceUrlSupportedScheme[] | undefined) => {
                              if (sourceUrlSupportedScheme) {
                                sourceUrlSupportedScheme.forEach((sourceUrlSupportedScheme: DbModelSourceUrlSupportedScheme) => {
                                  this.addSourceUrlSupportedScheme(sourceUrlSupportedScheme);
                                });
                              }
                            })
                          );
  }

  private getAllSourceUrlSupportedProvidersApiCall(): Observable< DbModelSourceUrlSupportedProvider[] | undefined > {
    return this.httpClient.get<DbModelSourceUrlSupportedProvider[]>(this.getApiUrlWithAddition("url/provider"))
                          .pipe(
                            map((getAllSourceUrlSupportedProvidersResult: DbModelSourceUrlSupportedProvider[]) => {
                              let sourceUrlSupportedProviders: DbModelSourceUrlSupportedProvider[] = [];
                              getAllSourceUrlSupportedProvidersResult.forEach((sourceUrlSupportedProviderResult: DbModelSourceUrlSupportedProvider) => {
                                let sourceUrlSupportedProvider = new DbModelSourceUrlSupportedProvider().deserialize(
                                  sourceUrlSupportedProviderResult
                                );
                                sourceUrlSupportedProviders.push(sourceUrlSupportedProvider);
                              });
                              return sourceUrlSupportedProviders;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source URL Supported Providers due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((sourceUrlSupportedProvider: DbModelSourceUrlSupportedProvider[] | undefined) => {
                              if (sourceUrlSupportedProvider) {
                                sourceUrlSupportedProvider.forEach((sourceUrlSupportedProvider: DbModelSourceUrlSupportedProvider) => {
                                  this.addSourceUrlSupportedProvider(sourceUrlSupportedProvider);
                                });
                              }
                            })
                          );
  }

}
