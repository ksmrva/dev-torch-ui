import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { DbModelSourceConfig } from "../../../../entity/model/database/source/config/db-model-source-config";
import { DbModelSourceUrl } from "../../../../entity/model/database/source/url/db-model-source-url";
import { BaseApiService } from "../../../base.api.service";
import { DbModelSourcePreset } from "../../../../entity/model/database/source/preset/db-model-source-preset";
import { DbModelSourceSupportedDriver } from "../../../../entity/model/database/source/config/driver/db-model-source-supported-driver";
import { DbModelSourceUrlSupportedProvider } from "../../../../entity/model/database/source/url/provider/db-model-source-url-supported-provider";
import { DbModelSourceUrlSupportedScheme } from "../../../../entity/model/database/source/url/scheme/db-model-source-url-supported-scheme";
import { DbModelSourceDataType } from "../../../../entity/model/database/source/type/db-model-source-data-type";
import { StringUtil } from "../../../../entity/misc/string/util/string-util";

@Injectable({
  providedIn: 'root'
})
export class DatabaseModelSourceService extends BaseApiService {

  private dataTypes$: BehaviorSubject<DbModelSourceDataType[]>;

  private urls$: BehaviorSubject<DbModelSourceUrl[]>;

  private configs$: BehaviorSubject<DbModelSourceConfig[]>;

  private presets$: BehaviorSubject<DbModelSourcePreset[]>;

  private configSupportedDrivers$: BehaviorSubject<DbModelSourceSupportedDriver[]>;

  private urlSupportedSchemes$: BehaviorSubject<DbModelSourceUrlSupportedScheme[]>;

  private urlSupportedProviders$: BehaviorSubject<DbModelSourceUrlSupportedProvider[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.dataTypes$ = new BehaviorSubject<DbModelSourceDataType[]>([]);
    this.urls$ = new BehaviorSubject<DbModelSourceUrl[]>([]);
    this.configs$ = new BehaviorSubject<DbModelSourceConfig[]>([]);
    this.presets$ = new BehaviorSubject<DbModelSourcePreset[]>([]);
    this.configSupportedDrivers$ = new BehaviorSubject<DbModelSourceSupportedDriver[]>([]);
    this.urlSupportedSchemes$ = new BehaviorSubject<DbModelSourceUrlSupportedScheme[]>([]);
    this.urlSupportedProviders$ = new BehaviorSubject<DbModelSourceUrlSupportedProvider[]>([]);

    this.initDataTypes();
    this.initUrls();
    this.initConfigs();
    this.initPresets();
    this.initConfigSupportedDrivers();
    this.initUrlSupportedSchemes();
    this.initUrlSupportedProviders();
  }

  override getResourcePathForApiUrl(): string {
    return "/model/db/source";
  }

  getDataTypes(): Observable<DbModelSourceDataType[]> {
    return this.dataTypes$.asObservable();
  }

  getUrls(): Observable<DbModelSourceUrl[]> {
    return this.urls$.asObservable();
  }

  getConfigs(): Observable<DbModelSourceConfig[]> {
    return this.configs$.asObservable();
  }

  getPresets(): Observable<DbModelSourcePreset[]> {
    return this.presets$.asObservable();
  }

  getConfigSupportedDrivers(): Observable<DbModelSourceSupportedDriver[]> {
    return this.configSupportedDrivers$.asObservable();
  }

  getUrlSupportedSchemes(): Observable<DbModelSourceUrlSupportedScheme[]> {
    return this.urlSupportedSchemes$.asObservable();
  }

  getUrlSupportedProviders(): Observable<DbModelSourceUrlSupportedProvider[]> {
    return this.urlSupportedProviders$.asObservable();
  }

  createUrl( urlToCreate: DbModelSourceUrl ): Observable<DbModelSourceUrl | undefined> {
    let createUrlResult: Observable<DbModelSourceUrl | undefined>;
    let urlAlreadyCreated = this.urls$.value.find((url: DbModelSourceUrl) => {
      return url.isEqualTo(urlToCreate);
    });

    if (urlAlreadyCreated) {
      console.log( "Not attempting to create Database Model Source URL since it was found to already exist, returning undefined" );
      createUrlResult = of(undefined);
    } else {
      createUrlResult = this.createUrlApiCall(urlToCreate);
    }
    return createUrlResult;
  }

  createConfig( configToCreate: DbModelSourceConfig ): Observable<DbModelSourceConfig | undefined> {
    let createConfigResult: Observable<DbModelSourceConfig | undefined>;
    let configAlreadyCreated = this.configs$.value.find((config: DbModelSourceConfig) => {
      return config.isEqualTo(configToCreate);
    });

    if (configAlreadyCreated) {
      console.log( "Not attempting to create Database Model Source Config since it was found to already exist, returning undefined" );
      createConfigResult = of(undefined);
    } else {
      createConfigResult = this.createConfigApiCall(configToCreate);
    }
    return createConfigResult;
  }

  private initDataTypes(): void {
    this.getAllDataTypesApiCall().subscribe({
                                    next: (dataTypes: DbModelSourceDataType[] | undefined) => {
                                      if (!dataTypes) {
                                        throw new Error("Failed to initialize the Database Model Source Data Types");
                                      }
                                    },
                                    error: (err: any) => {
                                      throw new Error("Failed to initialize the Database Model Source Data Types due to [" + err + "]");
                                    },
                                    complete: () => {
                                      console.log("Finished initializing Database Model Source ");
                                    }
                                  });
  }

  private initUrls(): void {
    this.getAllUrlsApiCall().subscribe({
                                  next: (urls: DbModelSourceUrl[] | undefined) => {
                                    if (!urls) {
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

  private initConfigs(): void {
    this.getAllConfigsApiCall().subscribe({
                                    next: (configs: DbModelSourceConfig[] | undefined) => {
                                      if (!configs) {
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

  private initPresets(): void {
    this.getAllPresetsApiCall().subscribe({
                                    next: (presets: DbModelSourcePreset[] | undefined) => {
                                      if (!presets) {
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

  private initConfigSupportedDrivers(): void {
    this.getAllConfigSupportedDriversApiCall().subscribe({
                                                    next: (configSupportedDrivers: DbModelSourceSupportedDriver[] | undefined) => {
                                                      if (!configSupportedDrivers) {
                                                        throw new Error("Failed to initialize the Database Model Source Config Supported Drivers");
                                                      }
                                                    },
                                                    error: (err: any) => {
                                                      throw new Error( "Failed to initialize the Database Model Source Config Supported Drivers due to [" + err + "]" );
                                                    },
                                                    complete: () => {
                                                      console.log("Finished initializing Database Model Source Config Supported Drivers");
                                                    }
                                                  });
  }

  private initUrlSupportedSchemes(): void {
    this.getAllUrlSupportedSchemesApiCall().subscribe({
                                                next: (urlSupportedSchemes: DbModelSourceUrlSupportedScheme[] | undefined) => {
                                                  if (!urlSupportedSchemes) {
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

  private initUrlSupportedProviders(): void {
    this.getAllUrlSupportedProvidersApiCall().subscribe({
                                                  next: (urlSupportedProviders: DbModelSourceUrlSupportedProvider[] | undefined) => {
                                                    if (!urlSupportedProviders) {
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

  private addDbDataType(dataTypeToAdd: DbModelSourceDataType): void {
    if (
      dataTypeToAdd
      && StringUtil.isNotEmpty(dataTypeToAdd.name)
    ) {
      let dataTypeAlreadyAdded = this.dataTypes$.value.find((dataType: DbModelSourceDataType) => {
        return dataType.isEqualTo(dataTypeToAdd);
      });
      if (!dataTypeAlreadyAdded) {
        this.dataTypes$.next([...this.dataTypes$.value, dataTypeToAdd]);
      }
    }
  }

  private addSourceUrl(urlToAdd: DbModelSourceUrl): void {
    if (
      urlToAdd
      && urlToAdd.id !== null
      && urlToAdd.id !== undefined
    ) {
      let urlAlreadyAdded = this.urls$.value.find((url: DbModelSourceUrl) => {
        return url.isEqualTo(urlToAdd);
      });
      if (!urlAlreadyAdded) {
        this.urls$.next([ ...this.urls$.value, urlToAdd ]);
      }
    }
  }

  private addSourceConfig(configToAdd: DbModelSourceConfig): void {
    if (
      configToAdd
      && configToAdd.id !== null
      && configToAdd.id !== undefined
    ) {
      let configAlreadyAdded = this.configs$.value.find((config: DbModelSourceConfig) => {
        return config.isEqualTo(configToAdd);
      });
      if (!configAlreadyAdded) {
        this.configs$.next([ ...this.configs$.value, configToAdd ]);
      }
    }
  }

  private addSourcePreset(presetToAdd: DbModelSourcePreset): void {
    if (
      presetToAdd
      && presetToAdd.id !== null
      && presetToAdd.id !== undefined
    ) {
      let presetAlreadyAdded = this.presets$.value.find((preset: DbModelSourcePreset) => {
        return preset.isEqualTo(presetToAdd);
      });
      if (!presetAlreadyAdded) {
        this.presets$.next([ ...this.presets$.value, presetToAdd ]);
      }
    }
  }

  private addSourceSupportedDriver(configSupportedDriverToAdd: DbModelSourceSupportedDriver): void {
    if (
      configSupportedDriverToAdd
      && configSupportedDriverToAdd.id !== null
      && configSupportedDriverToAdd.id !== undefined
    ) {
      let configSupportedDriverAlreadyAdded = this.configSupportedDrivers$.value.find((configSupportedDriver: DbModelSourceSupportedDriver) => {
        return configSupportedDriver.isEqualTo(configSupportedDriverToAdd);
      });
      if (!configSupportedDriverAlreadyAdded) {
        this.configSupportedDrivers$.next([ ...this.configSupportedDrivers$.value, configSupportedDriverToAdd ]);
      }
    }
  }

  private addUrlSupportedScheme(urlSupportedSchemeToAdd: DbModelSourceUrlSupportedScheme): void {
    if (
      urlSupportedSchemeToAdd
      && urlSupportedSchemeToAdd.id !== null
      && urlSupportedSchemeToAdd.id !== undefined
    ) {
      let urlSupportedSchemeAlreadyAdded = this.urlSupportedSchemes$.value.find((urlSupportedScheme: DbModelSourceUrlSupportedScheme) => {
        return urlSupportedScheme.isEqualTo(urlSupportedSchemeToAdd);
      });
      if (!urlSupportedSchemeAlreadyAdded) {
        this.urlSupportedSchemes$.next([ ...this.urlSupportedSchemes$.value, urlSupportedSchemeToAdd ]);
      }
    }
  }

  private addUrlSupportedProvider(urlSupportedProviderToAdd: DbModelSourceUrlSupportedProvider): void {
    if (
      urlSupportedProviderToAdd
      && urlSupportedProviderToAdd.id !== null
      && urlSupportedProviderToAdd.id !== undefined
    ) {
      let urlSupportedProviderAlreadyAdded = this.urlSupportedProviders$.value.find((urlSupportedProvider: DbModelSourceUrlSupportedProvider) => {
        return urlSupportedProvider.isEqualTo(urlSupportedProviderToAdd);
      });
      if (!urlSupportedProviderAlreadyAdded) {
        this.urlSupportedProviders$.next([ ...this.urlSupportedProviders$.value, urlSupportedProviderToAdd ]);
      }
    }
  }

  private createUrlApiCall( urlToCreate: DbModelSourceUrl ): Observable<DbModelSourceUrl | undefined> {
    return this.httpClient.post<DbModelSourceUrl>(this.getApiUrlWithAddition("url"), urlToCreate)
                          .pipe(
                            map((createUrlResult: DbModelSourceUrl) => {
                              return new DbModelSourceUrl().deserialize(createUrlResult);
                            }),
                            catchError((error: any) => {
                              console.log( "Failed to create new Database Model Source URL due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((url: DbModelSourceUrl | undefined) => {
                              if (url) {
                                this.addSourceUrl(url);
                              }
                            })
                          );
  }

  private createConfigApiCall( config: DbModelSourceConfig ): Observable<DbModelSourceConfig | undefined> {
    return this.httpClient.post<DbModelSourceConfig>(this.getApiUrl(), config)
                          .pipe(
                            map((createConfigResult: DbModelSourceConfig) => {
                              return new DbModelSourceConfig().deserialize(createConfigResult);
                            }),
                            catchError((error) => {
                              console.log( "Failed to create new Database Model Source Config due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((config: DbModelSourceConfig | undefined) => {
                              if (config) {
                                this.addSourceConfig(config);
                              }
                            })
                          );
  }

  private getAllDataTypesApiCall(): Observable<DbModelSourceDataType[] | undefined> {
    return this.httpClient.get<DbModelSourceDataType[]>(this.getApiUrlWithAddition("data/type"))
                          .pipe(
                            map((getAllDataTypesResult: DbModelSourceDataType[]) => {
                              let dataTypes: DbModelSourceDataType[] = [];
                              getAllDataTypesResult.forEach((dataTypeResult: DbModelSourceDataType) => {
                                let dataType = new DbModelSourceDataType().deserialize(dataTypeResult);
                                dataTypes.push(dataType);
                              });
                              return dataTypes;
                            }),
                            catchError((error) => {
                              console.log("Failed to get all Database Model Source Data Types due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((dataTypes: DbModelSourceDataType[] | undefined) => {
                              if (dataTypes) {
                                dataTypes.forEach((dataType: DbModelSourceDataType) => {
                                  this.addDbDataType(dataType);
                                });
                              }
                            })
                          );
  }

  private getAllUrlsApiCall(): Observable< DbModelSourceUrl[] | undefined > {
    return this.httpClient.get<DbModelSourceUrl[]>(this.getApiUrlWithAddition("url"))
                          .pipe(
                            map((getAllUrlsResult: DbModelSourceUrl[]) => {
                              let urls: DbModelSourceUrl[] = [];
                              getAllUrlsResult.forEach((urlResult: DbModelSourceUrl) => {
                                let url = new DbModelSourceUrl().deserialize( urlResult );
                                urls.push(url);
                              });
                              return urls;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source URLs due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((urls: DbModelSourceUrl[] | undefined) => {
                              if (urls) {
                                urls.forEach((url: DbModelSourceUrl) => {
                                  this.addSourceUrl(url);
                                });
                              }
                            })
                          );
  }

  private getAllConfigsApiCall(): Observable< DbModelSourceConfig[] | undefined > {
    return this.httpClient.get<DbModelSourceConfig[]>(this.getApiUrl())
                          .pipe(
                            map((getAllConfigsResult: DbModelSourceConfig[]) => {
                              let configs: DbModelSourceConfig[] = [];
                              getAllConfigsResult.forEach((configResult: DbModelSourceConfig) => {
                                let config = new DbModelSourceConfig().deserialize( configResult );
                                configs.push(config);
                              });
                              return configs;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source Configs due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((configs: DbModelSourceConfig[] | undefined) => {
                              if (configs) {
                                configs.forEach((config: DbModelSourceConfig) => {
                                  this.addSourceConfig(config);
                                });
                              }
                            })
                          );
  }

  private getAllPresetsApiCall(): Observable< DbModelSourcePreset[] | undefined > {
    return this.httpClient.get<DbModelSourcePreset[]>(this.getApiUrlWithAddition("preset"))
                          .pipe(
                            map((getAllPresetsResult: DbModelSourcePreset[]) => {
                              let presets: DbModelSourcePreset[] = [];
                              getAllPresetsResult.forEach((presetResult: DbModelSourcePreset) => {
                                let preset = new DbModelSourcePreset().deserialize( presetResult );
                                presets.push(preset);
                              });
                              return presets;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source Presets due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((presets: DbModelSourcePreset[] | undefined) => {
                              if (presets) {
                                presets.forEach((preset: DbModelSourcePreset) => {
                                  this.addSourcePreset(preset);
                                });
                              }
                            })
                          );
  }

  private getAllConfigSupportedDriversApiCall(): Observable< DbModelSourceSupportedDriver[] | undefined > {
    return this.httpClient.get<DbModelSourceSupportedDriver[]>(this.getApiUrlWithAddition("driver"))
                          .pipe(
                            map((getAllConfigSupportedDriversResult: DbModelSourceSupportedDriver[]) => {
                              let configSupportedDrivers: DbModelSourceSupportedDriver[] = [];
                              getAllConfigSupportedDriversResult.forEach((configSupportedDriverResult: DbModelSourceSupportedDriver) => {
                                let configSupportedDriver = new DbModelSourceSupportedDriver().deserialize(
                                  configSupportedDriverResult
                                );
                                configSupportedDrivers.push(configSupportedDriver);
                              });
                              return configSupportedDrivers;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source Config Supported Drivers due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((configSupportedDriver: DbModelSourceSupportedDriver[] | undefined) => {
                              if (configSupportedDriver) {
                                configSupportedDriver.forEach((configSupportedDriver: DbModelSourceSupportedDriver) => {
                                  this.addSourceSupportedDriver(configSupportedDriver);
                                });
                              }
                            })
                          );
  }

  private getAllUrlSupportedSchemesApiCall(): Observable< DbModelSourceUrlSupportedScheme[] | undefined > {
    return this.httpClient.get<DbModelSourceUrlSupportedScheme[]>(this.getApiUrlWithAddition("url/scheme"))
                          .pipe(
                            map((getAllUrlSupportedSchemesResult: DbModelSourceUrlSupportedScheme[]) => {
                              let urlSupportedSchemes: DbModelSourceUrlSupportedScheme[] = [];
                              getAllUrlSupportedSchemesResult.forEach((urlSupportedSchemeResult: DbModelSourceUrlSupportedScheme) => {
                                let urlSupportedScheme = new DbModelSourceUrlSupportedScheme().deserialize(
                                  urlSupportedSchemeResult
                                );
                                urlSupportedSchemes.push(urlSupportedScheme);
                              });
                              return urlSupportedSchemes;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source URL Supported Schemes due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((urlSupportedScheme: DbModelSourceUrlSupportedScheme[] | undefined) => {
                              if (urlSupportedScheme) {
                                urlSupportedScheme.forEach((urlSupportedScheme: DbModelSourceUrlSupportedScheme) => {
                                  this.addUrlSupportedScheme(urlSupportedScheme);
                                });
                              }
                            })
                          );
  }

  private getAllUrlSupportedProvidersApiCall(): Observable< DbModelSourceUrlSupportedProvider[] | undefined > {
    return this.httpClient.get<DbModelSourceUrlSupportedProvider[]>(this.getApiUrlWithAddition("url/provider"))
                          .pipe(
                            map((getAllUrlSupportedProvidersResult: DbModelSourceUrlSupportedProvider[]) => {
                              let urlSupportedProviders: DbModelSourceUrlSupportedProvider[] = [];
                              getAllUrlSupportedProvidersResult.forEach((urlSupportedProviderResult: DbModelSourceUrlSupportedProvider) => {
                                let urlSupportedProvider = new DbModelSourceUrlSupportedProvider().deserialize(
                                  urlSupportedProviderResult
                                );
                                urlSupportedProviders.push(urlSupportedProvider);
                              });
                              return urlSupportedProviders;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Database Model Source URL Supported Providers due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((urlSupportedProvider: DbModelSourceUrlSupportedProvider[] | undefined) => {
                              if (urlSupportedProvider) {
                                urlSupportedProvider.forEach((urlSupportedProvider: DbModelSourceUrlSupportedProvider) => {
                                  this.addUrlSupportedProvider(urlSupportedProvider);
                                });
                              }
                            })
                          );
  }

}
