import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import { DbModelSourceConfig } from "../../../../../../../entity/model/database/source/config/db-model-source-config";
import { DatabaseModelSourceService } from "../../../../../../../service/model/database/source/db-model-source.service";
import { BaseComponent } from "../../../../../../shared/base/base.component";
import { DbModelSourceSupportedDriver } from "../../../../../../../entity/model/database/source/config/driver/db-model-source-supported-driver";
import { DbModelSourceUrl } from "../../../../../../../entity/model/database/source/url/db-model-source-url";
import { ApiEntity } from '../../../../../../../entity/shared/api-entity';
import { DbModelSourcePreset } from "../../../../../../../entity/model/database/source/preset/db-model-source-preset";

@Component({
  selector: "database-model-source-config-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./database-model-source-config-edit-form.component.html",
  styleUrl: "./database-model-source-config-edit-form.component.scss"
})
export class DatabaseModelSourceConfigEditFormComponent extends BaseComponent implements OnInit {

  @Input() configForEditObservable: Observable< DbModelSourceConfig | undefined >;

  @Output() configWasSavedEvent: EventEmitter<boolean>;

  @Output() cancelButtonClickedEvent: EventEmitter<boolean>;

  configForEdit: DbModelSourceConfig | undefined;

  configEditForm: FormGroup;

  availableUrls: DbModelSourceUrl[];

  availableSupportedDrivers: DbModelSourceSupportedDriver[];

  availablePresets: DbModelSourcePreset[];

  constructor(
    private formBuilder: FormBuilder,
    private databaseModelSourceService: DatabaseModelSourceService
  ) {
    super();
    this.configForEditObservable = of(undefined);
    this.configWasSavedEvent = new EventEmitter<boolean>();
    this.cancelButtonClickedEvent = new EventEmitter<boolean>();

    this.configForEdit = undefined;
    this.configEditForm = this.formBuilder.group({
      urlId: new FormControl(),
      driverName: new FormControl(),
      username: new FormControl(),
      password: new FormControl()
    });
    this.availableUrls = [];
    this.availableSupportedDrivers = [];
    this.availablePresets = [];
  }

  ngOnInit(): void {
    let configToEditSubscription = this.configForEditObservable.subscribe({
                                                                      next: (config: DbModelSourceConfig | undefined) => {
                                                                        this.setConfigForEdit(config);
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error( "Failed to load the Database Model Source Config for editing due to [" + err + "]" );
                                                                      },
                                                                      complete: () => {
                                                                        console.log("Finished loading the Database Model Source Config for editing");
                                                                      }
                                                                    });
    this.addLongLivingSubscription(configToEditSubscription);

    let availableUrlsSubscription = this.databaseModelSourceService.getUrls().subscribe({
                                                                                  next: (nextUrls: DbModelSourceUrl[] | undefined) => {
                                                                                    if (!nextUrls) {
                                                                                      throw new Error("Failed to load the available Database Model Source URLs");
                                                                                    }
                                                                                    this.availableUrls = nextUrls;
                                                                                  },
                                                                                  error: (err: any) => {
                                                                                    throw new Error( "Failed to load the available Database Model Source URLs due to [" + err + "]" );
                                                                                  },
                                                                                  complete: () => {
                                                                                    console.log("Finished loading the available Database Model Source URLs");
                                                                                  }
                                                                                });
    this.addLongLivingSubscription(availableUrlsSubscription);

    let availableSupportedDriversSubscription = this.databaseModelSourceService.getConfigSupportedDrivers().subscribe({
                                                                                                                next: (supportedDrivers: DbModelSourceSupportedDriver[] | undefined) => {
                                                                                                                  if (!supportedDrivers) {
                                                                                                                    throw new Error("Failed to load the available Database Model Source Config Supported Drivers");
                                                                                                                  }
                                                                                                                  this.availableSupportedDrivers = supportedDrivers;
                                                                                                                },
                                                                                                                error: (err: any) => {
                                                                                                                  throw new Error( "Failed to load the available Database Model Source Config Supported Drivers due to [" + err + "]" );
                                                                                                                },
                                                                                                                complete: () => {
                                                                                                                  console.log("Finished loading the available Database Model Source Config Supported Drivers");
                                                                                                                }
                                                                                                              });
    this.addLongLivingSubscription(availableSupportedDriversSubscription);

    let availablePresetsSubscription = this.databaseModelSourceService.getPresets().subscribe({
                                                                                        next: (nextPresets: DbModelSourcePreset[] | undefined) => {
                                                                                          if (!nextPresets) {
                                                                                            throw new Error("Failed to load the available Database Model Source Presets");
                                                                                          }
                                                                                          this.availablePresets = nextPresets;
                                                                                        },
                                                                                        error: (err: any) => {
                                                                                          throw new Error( "Failed to load the available Database Model Source Presets due to [" + err + "]" );
                                                                                        },
                                                                                        complete: () => {
                                                                                          console.log("Finished loading the available Database Model Source Presets");
                                                                                        }
                                                                                      });
    this.addLongLivingSubscription(availablePresetsSubscription);
  }

  saveConfig(): void {
    if (
      !this.configEditForm
      || !this.configEditForm.value
      || !this.configEditForm.valid
    ) {
      throw new Error("Database Model Source Config Edit Form was invalid, unable to save");
    }

    if (!this.configForEdit) {
      throw new Error("Database Model Source Config was undefined, unable to save");
    }

    if (this.isConfigNew(this.configForEdit)) {
      let urlId = this.configEditForm.value.urlId;
      let driverName = this.configEditForm.value.driverName;
      let username = this.configEditForm.value.username;
      let password = this.configEditForm.value.password;

      let sourceConfig: DbModelSourceConfig = new DbModelSourceConfig();
      let sourceUrl = this.getUrlFromId(urlId);
      if(sourceUrl) {
        sourceConfig.url = sourceUrl;
      }

      sourceConfig.driverName = driverName;
      sourceConfig.username = username;
      sourceConfig.password = password;

      this.databaseModelSourceService.createConfig(sourceConfig).subscribe({
                                                                        next: (createdConfig: DbModelSourceConfig | undefined) => {
                                                                          if (!createdConfig) {
                                                                            throw new Error("Failed to create Database Model Source Config");
                                                                          }
                                                                          this.handleSuccessfulSave();
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
    } else {
      // TODO: Update Config
    }
  }

  isConfigNew(config: DbModelSourceConfig | undefined): boolean {
    return ApiEntity.isEntityNew(config);
  }

  getUrlFromId(urlIdToFind: string): DbModelSourceUrl | undefined {
    return this.availableUrls.find((availableUrl: DbModelSourceUrl) => {
      return availableUrl.id.toString() === urlIdToFind;
    });
  }

  cancelButtonClicked(): void {
    this.resetEditForm();

    this.cancelButtonClickedEvent.emit(true);
  }

  resetEditForm(): void {
    this.configEditForm.reset();
    this.configForEdit = undefined;
  }

  handleSuccessfulSave(): void {
    this.resetEditForm();

    this.configWasSavedEvent.emit(true);
  }

  private setConfigForEdit( sourceConfigForEdit: DbModelSourceConfig | undefined ): void {
    if (sourceConfigForEdit) {
      this.configForEdit = sourceConfigForEdit;

      this.configEditForm.setValue({
        urlId: sourceConfigForEdit.url.id,
        driverName: sourceConfigForEdit.driverName,
        username: sourceConfigForEdit.username,
        password: sourceConfigForEdit.password
      });
    }
  }

}
