import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { DbModelSourcePreset } from "../../../../../../../entity/model/database/source/preset/db-model-source-preset";
import { DbModelSourceUrl } from "../../../../../../../entity/model/database/source/url/db-model-source-url";
import { DbModelSourceService } from "../../../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../../../base.component";
import { DbModelSourceUrlSupportedProvider } from "../../../../../../../entity/model/database/source/url/provider/db-model-source-url-supported-provider";
import { DbModelSourceUrlSupportedScheme } from "../../../../../../../entity/model/database/source/url/scheme/db-model-source-url-supported-scheme";

@Component({
  selector: "db-model-source-url-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./db-model-source-url-edit-form.component.html",
  styleUrl: "./db-model-source-url-edit-form.component.scss"
})
export class DbModelSourceUrlEditFormComponent extends BaseComponent implements OnInit {

  @Input() sourceUrlForEditObservable: Observable< DbModelSourceUrl | undefined >;

  @Output() sourceUrlWasUpdated: EventEmitter<boolean>;

  @Output() resetSourceUrlEditButtonClicked: EventEmitter<boolean>;

  sourceUrlEditForm: FormGroup;

  sourceUrlForEdit: DbModelSourceUrl | undefined;

  sourceUrlForEdit$: BehaviorSubject<DbModelSourceUrl | undefined>;

  availableSourcePresets: DbModelSourcePreset[];

  availableSourceUrlSupportedSchemes: DbModelSourceUrlSupportedScheme[];

  availableSourceUrlSupportedProviders: DbModelSourceUrlSupportedProvider[];

  constructor(
    private dbModelSourceService: DbModelSourceService,
    formBuilder: FormBuilder
  ) {
    super();
    this.sourceUrlForEditObservable = of(undefined);
    this.sourceUrlWasUpdated = new EventEmitter<boolean>();
    this.resetSourceUrlEditButtonClicked = new EventEmitter<boolean>();

    this.sourceUrlEditForm = formBuilder.group({
      scheme: new FormControl(),
      provider: new FormControl(),
      hostname: new FormControl(),
      port: new FormControl(),
      maintenanceDatabaseName: new FormControl()
    });

    this.sourceUrlForEdit = undefined;
    this.sourceUrlForEdit$ = new BehaviorSubject<DbModelSourceUrl | undefined>( undefined );
    this.availableSourcePresets = [];
    this.availableSourceUrlSupportedSchemes = [];
    this.availableSourceUrlSupportedProviders = [];
  }

  ngOnInit(): void {
    let sourceUrlForEditSubscription = this.sourceUrlForEditObservable.subscribe({
                                                                              next: (sourceUrl: DbModelSourceUrl | undefined) => {
                                                                                this.setSourceUrlForEdit(sourceUrl);
                                                                              },
                                                                              error: (err: any) => {
                                                                                throw new Error( "Failed to load the Database Model Source URL for editing due to [" + err + "]" );
                                                                              },
                                                                              complete: () => {
                                                                                console.log("Finished loading the Database Model Source URL for edit");
                                                                              }
                                                                            });
    this.addLongLivingSubscription(sourceUrlForEditSubscription);

    let availableSourcePresetsSubscription = this.dbModelSourceService.getSourcePresets().subscribe({
                                                                                              next: (sourcePresets: DbModelSourcePreset[] | undefined) => {
                                                                                                if (!sourcePresets) {
                                                                                                  throw new Error("Failed to load the available Database Model Source Presets");
                                                                                                }
                                                                                                this.availableSourcePresets = sourcePresets;
                                                                                              },
                                                                                              error: (err: any) => {
                                                                                                throw new Error( "Failed to load the available Database Model Source Presets due to [" + err + "]" );
                                                                                              },
                                                                                              complete: () => {
                                                                                                console.log("Finished loading the available Database Model Source Presets");
                                                                                              }
                                                                                            });
    this.addLongLivingSubscription(availableSourcePresetsSubscription);

    let availableSourceUrlSupportedSchemesSubscription = this.dbModelSourceService.getSourceUrlSupportedSchemes().subscribe({
                                                                                                                      next: (sourceUrlSupportedSchemes: DbModelSourceUrlSupportedScheme[] | undefined) => {
                                                                                                                        if (!sourceUrlSupportedSchemes) {
                                                                                                                          throw new Error("Failed to load the available Database Model Source URL Supported Schemes");
                                                                                                                        }
                                                                                                                        this.availableSourceUrlSupportedSchemes = sourceUrlSupportedSchemes;
                                                                                                                      },
                                                                                                                      error: (err: any) => {
                                                                                                                        throw new Error( "Failed to load the available Database Model Source URL Supported Schemes due to [" + err + "]" );
                                                                                                                      },
                                                                                                                      complete: () => {
                                                                                                                        console.log("Finished loading the available Database Model Source URL Supported Schemes");
                                                                                                                      }
                                                                                                                    });
    this.addLongLivingSubscription(availableSourceUrlSupportedSchemesSubscription);

    let availableSourceUrlSupportedProvidersSubscription = this.dbModelSourceService.getSourceUrlSupportedProviders().subscribe({
                                                                                                                            next: (sourceUrlSupportedProviders: DbModelSourceUrlSupportedProvider[] | undefined) => {
                                                                                                                              if (!sourceUrlSupportedProviders) {
                                                                                                                                throw new Error("Failed to load the available Database Model Source URL Supported Providers");
                                                                                                                              }
                                                                                                                              this.availableSourceUrlSupportedProviders = sourceUrlSupportedProviders;
                                                                                                                            },
                                                                                                                            error: (err: any) => {
                                                                                                                              throw new Error( "Failed to load the available Database Model Source URL Supported Providers due to [" + err + "]" );
                                                                                                                            },
                                                                                                                            complete: () => {
                                                                                                                              console.log("Finished loading the available Database Model Source URL Supported Providers");
                                                                                                                            }
                                                                                                                          });
    this.addLongLivingSubscription(availableSourceUrlSupportedProvidersSubscription);
  }

  saveSourceUrl(): void {
    if (
      !this.sourceUrlEditForm
      || !this.sourceUrlEditForm.value
      || !this.sourceUrlEditForm.valid
    ) {
      // TODO: handle error
    }

    if (this.sourceUrlForEdit) {
      if (
        this.sourceUrlForEdit.id !== null
        && this.sourceUrlForEdit.id !== undefined
        && this.sourceUrlForEdit.id >= 0
      ) {
        // TODO: Update Source URL

      } else {
        let scheme = this.sourceUrlEditForm.value.scheme;
        let provider = this.sourceUrlEditForm.value.provider;
        let hostname = this.sourceUrlEditForm.value.hostname;
        let port = this.sourceUrlEditForm.value.port;
        let maintenanceDatabaseName = this.sourceUrlEditForm.value.maintenanceDatabaseName;

        let sourceUrlForCreate: DbModelSourceUrl = new DbModelSourceUrl();
        sourceUrlForCreate.scheme = scheme;
        sourceUrlForCreate.hostname = hostname;
        sourceUrlForCreate.port = port;
        sourceUrlForCreate.provider = provider;
        sourceUrlForCreate.maintenanceDatabaseName = maintenanceDatabaseName;

        this.dbModelSourceService.createSourceUrl(sourceUrlForCreate).subscribe({
                                                                    next: (createdSourceUrl: DbModelSourceUrl | undefined) => {
                                                                      if (!createdSourceUrl) {
                                                                        throw new Error("Failed to create the Database Model Source URL");
                                                                      } else {
                                                                        this.sourceUrlEditForm.reset();
                                                                      }
                                                                    },
                                                                    error: (error: any) => {
                                                                      throw new Error( "Failed to create the Database Model Source URL due to [" + error + "]" );
                                                                    },
                                                                    complete: () => {
                                                                      console.log("Finished creating Database Model Source URL");
                                                                    }
                                                                  });
      }
    }
  }

  isSourceUrlNew(sourceUrl: DbModelSourceUrl | undefined): boolean {
    let isSourceUrlNew = false;
    if (sourceUrl && sourceUrl.isNewEntity()) {
      isSourceUrlNew = true;
    }
    return isSourceUrlNew;
  }

  getSchemeTextPreview(): string {
    let schemeTextPreview;
    if(this.sourceUrlEditForm.value.scheme) {
      schemeTextPreview = this.sourceUrlEditForm.value.scheme;
    } else {
      schemeTextPreview = "{scheme}";
    }
    return schemeTextPreview;
  }

  getProviderTextPreview(): string {
    let providerTextPreview;
    if(this.sourceUrlEditForm.value.provider) {
      providerTextPreview = this.sourceUrlEditForm.value.provider;
    } else {
      providerTextPreview = "{provider}";
    }
    return providerTextPreview;
  }

  getHostnameTextPreview(): string {
    let hostnameTextPreview;
    if(this.sourceUrlEditForm.value.hostname) {
      hostnameTextPreview = this.sourceUrlEditForm.value.hostname;
    } else {
      hostnameTextPreview = "{hostname}";
    }
    return hostnameTextPreview;
  }

  getPortTextPreview(): string {
    let portTextPreview;
    if(this.sourceUrlEditForm.value.port) {
      portTextPreview = this.sourceUrlEditForm.value.port;
    } else {
      portTextPreview = "{port}";
    }
    return portTextPreview;
  }

  getMaintenanceDbNameTextPreview(): string {
    let maintenanceDbNameTextPreview;
    if(this.sourceUrlEditForm.value.maintenanceDatabaseName) {
      maintenanceDbNameTextPreview = this.sourceUrlEditForm.value.maintenanceDatabaseName;
    } else {
      maintenanceDbNameTextPreview = "{maintenance_database_name}";
    }
    return maintenanceDbNameTextPreview;
  }

  resetSourceUrlEditForms(): void {
    this.sourceUrlEditForm.reset();
    this.sourceUrlForEdit = undefined;
  }

  resetSourceUrlEditAfterSave(): void {
    this.resetSourceUrlEditForms();

    this.sourceUrlWasUpdated.emit(true);
  }

  resetSourceUrlEdit(): void {
    this.resetSourceUrlEditForms();

    this.resetSourceUrlEditButtonClicked.emit(true);
  }

  private setSourceUrlForEdit( sourceUrlForEdit: DbModelSourceUrl | undefined ): void {
    if (sourceUrlForEdit) {
      this.sourceUrlForEdit = sourceUrlForEdit;

      this.setFormValues(this.sourceUrlForEdit);
      this.sourceUrlForEdit$.next(this.sourceUrlForEdit);
    }
  }

  private setFormValues(sourceUrlForEdit: DbModelSourceUrl): void {
    this.sourceUrlEditForm.setValue({
      scheme: sourceUrlForEdit.scheme,
      provider: sourceUrlForEdit.provider,
      hostname: sourceUrlForEdit.hostname,
      port: sourceUrlForEdit.port,
      maintenanceDatabaseName: sourceUrlForEdit.maintenanceDatabaseName
    });
  }

}
