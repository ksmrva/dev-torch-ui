import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { DbModelSourcePreset } from "../../../../../../../entity/model/database/source/preset/db-model-source-preset";
import { DbModelSourceUrl } from "../../../../../../../entity/model/database/source/url/db-model-source-url";
import { DatabaseModelSourceService } from "../../../../../../../service/model/database/source/db-model-source.service";
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

  @Input() urlForEditObservable: Observable< DbModelSourceUrl | undefined >;

  @Output() urlWasUpdated: EventEmitter<boolean>;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  urlEditForm: FormGroup;

  urlForEdit: DbModelSourceUrl | undefined;

  urlForEdit$: BehaviorSubject<DbModelSourceUrl | undefined>;

  availablePresets: DbModelSourcePreset[];

  availableUrlSupportedSchemes: DbModelSourceUrlSupportedScheme[];

  availableUrlSupportedProviders: DbModelSourceUrlSupportedProvider[];

  constructor(
    private databaseModelSourceService: DatabaseModelSourceService,
    formBuilder: FormBuilder
  ) {
    super();
    this.urlForEditObservable = of(undefined);
    this.urlWasUpdated = new EventEmitter<boolean>();
    this.resetEditButtonClicked = new EventEmitter<boolean>();

    this.urlEditForm = formBuilder.group({
      scheme: new FormControl(),
      provider: new FormControl(),
      hostname: new FormControl(),
      port: new FormControl(),
      adminDatabaseName: new FormControl()
    });

    this.urlForEdit = undefined;
    this.urlForEdit$ = new BehaviorSubject<DbModelSourceUrl | undefined>( undefined );
    this.availablePresets = [];
    this.availableUrlSupportedSchemes = [];
    this.availableUrlSupportedProviders = [];
  }

  ngOnInit(): void {
    let urlForEditSubscription = this.urlForEditObservable.subscribe({
                                                                next: (url: DbModelSourceUrl | undefined) => {
                                                                  this.setUrlForEdit(url);
                                                                },
                                                                error: (err: any) => {
                                                                  throw new Error( "Failed to load the Database Model Source URL for editing due to [" + err + "]" );
                                                                },
                                                                complete: () => {
                                                                  console.log("Finished loading the Database Model Source URL for edit");
                                                                }
                                                              });
    this.addLongLivingSubscription(urlForEditSubscription);

    let availablePresetsSubscription = this.databaseModelSourceService.getPresets().subscribe({
                                                                                        next: (presets: DbModelSourcePreset[] | undefined) => {
                                                                                          if (!presets) {
                                                                                            throw new Error("Failed to load the available Database Model Source Presets");
                                                                                          }
                                                                                          this.availablePresets = presets;
                                                                                        },
                                                                                        error: (err: any) => {
                                                                                          throw new Error( "Failed to load the available Database Model Source Presets due to [" + err + "]" );
                                                                                        },
                                                                                        complete: () => {
                                                                                          console.log("Finished loading the available Database Model Source Presets");
                                                                                        }
                                                                                      });
    this.addLongLivingSubscription(availablePresetsSubscription);

    let availableUrlSupportedSchemesSubscription = this.databaseModelSourceService.getUrlSupportedSchemes().subscribe({
                                                                                                                next: (sourceSupportedSchemes: DbModelSourceUrlSupportedScheme[] | undefined) => {
                                                                                                                  if (!sourceSupportedSchemes) {
                                                                                                                    throw new Error("Failed to load the available Database Model Source URL Supported Schemes");
                                                                                                                  }
                                                                                                                  this.availableUrlSupportedSchemes = sourceSupportedSchemes;
                                                                                                                },
                                                                                                                error: (err: any) => {
                                                                                                                  throw new Error( "Failed to load the available Database Model Source URL Supported Schemes due to [" + err + "]" );
                                                                                                                },
                                                                                                                complete: () => {
                                                                                                                  console.log("Finished loading the available Database Model Source URL Supported Schemes");
                                                                                                                }
                                                                                                              });
    this.addLongLivingSubscription(availableUrlSupportedSchemesSubscription);

    let availableUrlSupportedProvidersSubscription = this.databaseModelSourceService.getUrlSupportedProviders().subscribe({
                                                                                                                    next: (urlSupportedProviders: DbModelSourceUrlSupportedProvider[] | undefined) => {
                                                                                                                      if (!urlSupportedProviders) {
                                                                                                                        throw new Error("Failed to load the available Database Model Source URL Supported Providers");
                                                                                                                      }
                                                                                                                      this.availableUrlSupportedProviders = urlSupportedProviders;
                                                                                                                    },
                                                                                                                    error: (err: any) => {
                                                                                                                      throw new Error( "Failed to load the available Database Model Source URL Supported Providers due to [" + err + "]" );
                                                                                                                    },
                                                                                                                    complete: () => {
                                                                                                                      console.log("Finished loading the available Database Model Source URL Supported Providers");
                                                                                                                    }
                                                                                                                  });
    this.addLongLivingSubscription(availableUrlSupportedProvidersSubscription);
  }

  saveSourceUrl(): void {
    if (
      !this.urlEditForm
      || !this.urlEditForm.value
      || !this.urlEditForm.valid
    ) {
      // TODO: handle error
    }

    if (this.urlForEdit) {
      if (
        this.urlForEdit.id !== null
        && this.urlForEdit.id !== undefined
        && this.urlForEdit.id >= 0
      ) {
        // TODO: Update Source URL

      } else {
        let scheme = this.urlEditForm.value.scheme;
        let provider = this.urlEditForm.value.provider;
        let hostname = this.urlEditForm.value.hostname;
        let port = this.urlEditForm.value.port;
        let adminDatabaseName = this.urlEditForm.value.adminDatabaseName;

        let urlForCreate: DbModelSourceUrl = new DbModelSourceUrl();
        urlForCreate.scheme = scheme;
        urlForCreate.hostname = hostname;
        urlForCreate.port = port;
        urlForCreate.provider = provider;
        urlForCreate.adminDatabaseName = adminDatabaseName;

        this.databaseModelSourceService.createUrl(urlForCreate).subscribe({
                                                                    next: (createdUrl: DbModelSourceUrl | undefined) => {
                                                                      if (!createdUrl) {
                                                                        throw new Error("Failed to create the Database Model Source URL");
                                                                      } else {
                                                                        this.urlEditForm.reset();
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

  isSourceUrlNew(url: DbModelSourceUrl | undefined): boolean {
    let isUrlNew = false;
    if (url && url.isNewEntity()) {
      isUrlNew = true;
    }
    return isUrlNew;
  }

  getSchemeTextPreview(): string {
    let schemeTextPreview;
    if(this.urlEditForm.value.scheme) {
      schemeTextPreview = this.urlEditForm.value.scheme;
    } else {
      schemeTextPreview = "{scheme}";
    }
    return schemeTextPreview;
  }

  getProviderTextPreview(): string {
    let providerTextPreview;
    if(this.urlEditForm.value.provider) {
      providerTextPreview = this.urlEditForm.value.provider;
    } else {
      providerTextPreview = "{provider}";
    }
    return providerTextPreview;
  }

  getHostnameTextPreview(): string {
    let hostnameTextPreview;
    if(this.urlEditForm.value.hostname) {
      hostnameTextPreview = this.urlEditForm.value.hostname;
    } else {
      hostnameTextPreview = "{hostname}";
    }
    return hostnameTextPreview;
  }

  getPortTextPreview(): string {
    let portTextPreview;
    if(this.urlEditForm.value.port) {
      portTextPreview = this.urlEditForm.value.port;
    } else {
      portTextPreview = "{port}";
    }
    return portTextPreview;
  }

  getAdminDatabaseNameTextPreview(): string {
    let adminDatabaseNameTextPreview;
    if(this.urlEditForm.value.adminDatabaseName) {
      adminDatabaseNameTextPreview = this.urlEditForm.value.adminDatabaseName;
    } else {
      adminDatabaseNameTextPreview = "{admin_db_name}";
    }
    return adminDatabaseNameTextPreview;
  }

  resetUrlEditForms(): void {
    this.urlEditForm.reset();
    this.urlForEdit = undefined;
  }

  resetUrlEditAfterSave(): void {
    this.resetUrlEditForms();

    this.urlWasUpdated.emit(true);
  }

  resetUrlEdit(): void {
    this.resetUrlEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  private setUrlForEdit( urlForEdit: DbModelSourceUrl | undefined ): void {
    if (urlForEdit) {
      this.urlForEdit = urlForEdit;

      this.setFormValues(this.urlForEdit);
      this.urlForEdit$.next(this.urlForEdit);
    }
  }

  private setFormValues(urlForEdit: DbModelSourceUrl): void {
    this.urlEditForm.setValue({
      scheme: urlForEdit.scheme,
      provider: urlForEdit.provider,
      hostname: urlForEdit.hostname,
      port: urlForEdit.port,
      adminDatabaseName: urlForEdit.adminDatabaseName
    });
  }

}
