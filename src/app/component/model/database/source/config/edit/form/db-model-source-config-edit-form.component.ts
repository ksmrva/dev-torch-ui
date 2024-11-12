import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { DbModelSourceConfig } from "../../../../../../../entity/model/database/source/config/db-model-source-config";
import { DbModelSourcePreset } from "../../../../../../../entity/model/database/source/preset/db-model-source-preset";
import { DbModelSourceService } from "../../../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../../../base.component";
import { DbModelSourceUrl } from '../../../../../../../entity/model/database/source/url/db-model-source-url';
import { DbModelSourceSupportedDriver } from "../../../../../../../entity/model/database/source/driver/db-model-source-supported-driver";

@Component({
  selector: "db-model-source-config-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./db-model-source-config-edit-form.component.html",
  styleUrl: "./db-model-source-config-edit-form.component.scss"
})
export class DbModelSourceConfigEditFormComponent extends BaseComponent implements OnInit {

  @Input() sourceConfigForEditObservable: Observable< DbModelSourceConfig | undefined >;

  @Output() sourceConfigWasUpdated: EventEmitter<boolean>;

  @Output() resetSourceConfigEditButtonClicked: EventEmitter<boolean>;

  sourceConfigEditForm: FormGroup;

  sourceConfigForEdit: DbModelSourceConfig | undefined;

  sourceConfigForEdit$: BehaviorSubject<DbModelSourceConfig | undefined>;

  availableSourceConfigs: DbModelSourceConfig[];

  availableSourcePresets: DbModelSourcePreset[];

  availableSourceUrls: DbModelSourceUrl[];

  availableSupportedDrivers: DbModelSourceSupportedDriver[];

  constructor(
    private dbModelSourceService: DbModelSourceService,
    formBuilder: FormBuilder
  ) {
    super();
    this.sourceConfigForEditObservable = of(undefined);
    this.sourceConfigWasUpdated = new EventEmitter<boolean>();
    this.resetSourceConfigEditButtonClicked = new EventEmitter<boolean>();

    this.sourceConfigEditForm = formBuilder.group({
      urlId: new FormControl(),
      driverName: new FormControl(),
      username: new FormControl(),
      password: new FormControl()
    });

    this.sourceConfigForEdit = undefined;
    this.sourceConfigForEdit$ = new BehaviorSubject<DbModelSourceConfig | undefined>( undefined );
    this.availableSourceConfigs = [];
    this.availableSourcePresets = [];
    this.availableSourceUrls = [];
    this.availableSupportedDrivers = [];
  }

  ngOnInit(): void {
    let availableSourceConfigsSubscription = this.dbModelSourceService.getSourceConfigs().subscribe({
                                                                                                next: (sourceConfigs: DbModelSourceConfig[] | undefined) => {
                                                                                                  if (!sourceConfigs) {
                                                                                                    throw new Error("Failed to load the available Database Model Source Configs");
                                                                                                  }
                                                                                                  this.availableSourceConfigs = sourceConfigs;
                                                                                                },
                                                                                                error: (err: any) => {
                                                                                                  throw new Error( "Failed to load the available Database Model Source Configs due to [" + err + "]" );
                                                                                                },
                                                                                                complete: () => {
                                                                                                  console.log("Finished loading the available Database Model Source Configs");
                                                                                                }
                                                                                              });
     this.addLongLivingSubscription(availableSourceConfigsSubscription);

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

    let availableSourceUrlsSubscription = this.dbModelSourceService.getSourceUrls().subscribe({
                                                                                        next: (sourceUrls: DbModelSourceUrl[] | undefined) => {
                                                                                          if (!sourceUrls) {
                                                                                            throw new Error("Failed to load the available Database Model Source URLs");
                                                                                          }
                                                                                          this.availableSourceUrls = sourceUrls;
                                                                                        },
                                                                                        error: (err: any) => {
                                                                                          throw new Error( "Failed to load the available Database Model Source URLs due to [" + err + "]" );
                                                                                        },
                                                                                        complete: () => {
                                                                                          console.log("Finished loading the available Database Model Source URLs");
                                                                                        }
                                                                                      });
    this.addLongLivingSubscription(availableSourceUrlsSubscription);

    let availableSupportedDriversSubscription = this.dbModelSourceService.getSourceSupportedDrivers().subscribe({
                                                                                                            next: (supportedDrivers: DbModelSourceSupportedDriver[] | undefined) => {
                                                                                                              if (!supportedDrivers) {
                                                                                                                throw new Error("Failed to load the available Database Model Source Supported Drivers");
                                                                                                              }
                                                                                                              this.availableSupportedDrivers = supportedDrivers;
                                                                                                            },
                                                                                                            error: (err: any) => {
                                                                                                              throw new Error( "Failed to load the available Database Model Source Supported Drivers due to [" + err + "]" );
                                                                                                            },
                                                                                                            complete: () => {
                                                                                                              console.log("Finished loading the available Database Model Source Supported Drivers");
                                                                                                            }
                                                                                                          });
    this.addLongLivingSubscription(availableSupportedDriversSubscription);

    let sourceConfigToEditSubscription = this.sourceConfigForEditObservable.subscribe({
                                                                                  next: (sourceConfig: DbModelSourceConfig | undefined) => {
                                                                                    this.setSourceConfigForEdit(sourceConfig);
                                                                                  },
                                                                                  error: (err: any) => {
                                                                                    throw new Error( "Failed to load the Database Model Source Config for editing due to [" + err + "]" );
                                                                                  },
                                                                                  complete: () => {
                                                                                    console.log("Finished loading the Database Model Source Config for edit");
                                                                                  }
                                                                                });
    this.addLongLivingSubscription(sourceConfigToEditSubscription);
  }

  saveSourceConfig(): void {
    if (
      !this.sourceConfigEditForm
      || !this.sourceConfigEditForm.value
      || !this.sourceConfigEditForm.valid
    ) {
      // TODO: handle error
    }

    if (this.sourceConfigForEdit) {
      if (
        this.sourceConfigForEdit.id !== null
        && this.sourceConfigForEdit.id !== undefined
        && this.sourceConfigForEdit.id >= 0
      ) {
        // TODO: Update Source Config

      } else {
        let urlId = this.sourceConfigEditForm.value.urlId;
        let driverName = this.sourceConfigEditForm.value.driverName;
        let username = this.sourceConfigEditForm.value.username;
        let password = this.sourceConfigEditForm.value.password;

        let sourceConfig: DbModelSourceConfig = new DbModelSourceConfig();
        let sourceUrl = this.getSourceUrlFromId(urlId);
        if(sourceUrl) {
          sourceConfig.url = sourceUrl;
        }

        sourceConfig.driverName = driverName;
        sourceConfig.username = username;
        sourceConfig.password = password;

        this.dbModelSourceService.createDbModelConfig(sourceConfig).subscribe({
                                                                          next: (sourceConfig: DbModelSourceConfig | undefined) => {
                                                                            if (!sourceConfig) {
                                                                              throw new Error("Failed to create Database Model Source Config");
                                                                            } else {
                                                                              this.sourceConfigEditForm.reset();
                                                                            }
                                                                          },
                                                                          error: (err: any) => {
                                                                            throw new Error(
                                                                              "Failed to create Database Model Source Config due to [" + err + "]"
                                                                            );
                                                                          },
                                                                          complete: () => {
                                                                            console.log("Finished creating Database Model Source Config");
                                                                          }
                                                                        });
      }
    }
  }

  isSourceConfigNew(sourceConfig: DbModelSourceConfig | undefined): boolean {
    let isSourceConfigNew = false;
    if (sourceConfig && sourceConfig.isNewEntity()) {
      isSourceConfigNew = true;
    }
    return isSourceConfigNew;
  }

  getSourceUrlFromId(idToFind: string): DbModelSourceUrl | undefined {
    return this.availableSourceUrls.find((availableSourceUrl: DbModelSourceUrl) => {
      return availableSourceUrl.id.toString() === idToFind;
    });
  }

  resetSourceConfigEditForms(): void {
    this.sourceConfigEditForm.reset();
    this.sourceConfigForEdit = undefined;
  }

  resetSourceConfigEditAfterSave(): void {
    this.resetSourceConfigEditForms();

    this.sourceConfigWasUpdated.emit(true);
  }

  resetSourceConfigEdit(): void {
    this.resetSourceConfigEditForms();

    this.resetSourceConfigEditButtonClicked.emit(true);
  }

  private setSourceConfigForEdit( sourceConfigForEdit: DbModelSourceConfig | undefined ): void {
    if (sourceConfigForEdit) {
      this.sourceConfigForEdit = sourceConfigForEdit;

      this.setFormValues(this.sourceConfigForEdit);
      this.sourceConfigForEdit$.next(this.sourceConfigForEdit);
    }
  }

  private setFormValues(sourceConfigForEdit: DbModelSourceConfig): void {
    this.sourceConfigEditForm.setValue({
      urlId: sourceConfigForEdit.url.id,
      driverName: sourceConfigForEdit.driverName,
      username: sourceConfigForEdit.username,
      password: sourceConfigForEdit.password
    });
  }
}
