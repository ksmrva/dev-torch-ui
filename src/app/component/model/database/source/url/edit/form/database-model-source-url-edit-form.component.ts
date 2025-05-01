import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { DbModelSourcePreset } from "../../../../../../../entity/model/database/source/preset/db-model-source-preset";
import { DbModelSourceUrl } from "../../../../../../../entity/model/database/source/url/db-model-source-url";
import { DatabaseModelSourceService } from "../../../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../../../shared/base/base.component";
import { DbModelSourceUrlSupportedProvider } from "../../../../../../../entity/model/database/source/url/provider/db-model-source-url-supported-provider";
import { DbModelSourceUrlSupportedScheme } from "../../../../../../../entity/model/database/source/url/scheme/db-model-source-url-supported-scheme";
import { ApiEntity } from "../../../../../../../entity/shared/api-entity";

@Component({
  selector: "database-model-source-url-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./database-model-source-url-edit-form.component.html",
  styleUrl: "./database-model-source-url-edit-form.component.scss"
})
export class DatabaseModelSourceUrlEditFormComponent extends BaseComponent implements OnInit {

  @Input() urlForEditObservable: Observable< DbModelSourceUrl | undefined >;

  @Output() urlWasSavedEvent: EventEmitter<boolean>;

  @Output() cancelButtonClickedEvent: EventEmitter<boolean>;

  urlEditForm: FormGroup;

  urlForEdit: DbModelSourceUrl | undefined;

  availablePresets: DbModelSourcePreset[];

  availableUrlSupportedSchemes: DbModelSourceUrlSupportedScheme[];

  availableUrlSupportedProviders: DbModelSourceUrlSupportedProvider[];

  constructor(
    private databaseModelSourceService: DatabaseModelSourceService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.urlForEditObservable = of(undefined);
    this.urlWasSavedEvent = new EventEmitter<boolean>();
    this.cancelButtonClickedEvent = new EventEmitter<boolean>();

    this.urlEditForm = this.formBuilder.group({
      scheme: new FormControl("", Validators.required),
      provider: new FormControl("", Validators.required),
      hostname: new FormControl("", Validators.required),
      port: new FormControl("", Validators.required),
      adminDatabaseName: new FormControl("", Validators.required)
    });

    this.urlForEdit = undefined;
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

  saveUrl(): void {
    if (
      !this.urlEditForm
      || !this.urlEditForm.value
      || !this.urlEditForm.valid
    ) {
      throw new Error("Database Model Source URL Edit Form was invalid, unable to save");
    }

    if (!this.urlForEdit) {
      throw new Error("Database Model Source URL was undefined, unable to save");
    }

    if (this.isUrlNew(this.urlForEdit)) {
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
                                                                    }

                                                                    this.handleSuccessfulSave();
                                                                  },
                                                                  error: (error: any) => {
                                                                    throw new Error( "Failed to create the Database Model Source URL due to [" + error + "]" );
                                                                  },
                                                                  complete: () => {
                                                                    console.log("Finished creating Database Model Source URL");
                                                                  }
                                                                });
    } else {
      // TODO: Update URL
    }
  }

  isUrlNew(url: DbModelSourceUrl | undefined): boolean {
    return ApiEntity.isEntityNew(url);
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

  handleSuccessfulSave(): void {
    this.resetUrlEditForms();

    this.urlWasSavedEvent.emit(true);
  }

  cancelButtonClicked(): void {
    this.resetUrlEditForms();

    this.cancelButtonClickedEvent.emit(true);
  }

  private setUrlForEdit(urlForEdit: DbModelSourceUrl | undefined): void {
    if (urlForEdit) {
      this.urlForEdit = urlForEdit;

      this.setFormValues(this.urlForEdit);
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
