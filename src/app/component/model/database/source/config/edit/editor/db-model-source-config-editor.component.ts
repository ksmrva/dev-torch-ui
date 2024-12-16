import { Component, OnInit } from '@angular/core';
import { DbModelSourceConfigEditFormComponent } from "../form/db-model-source-config-edit-form.component";
import { MenuSelectComponent } from "../../../../../../edit/menu/select/menu-select.component";
import { BehaviorSubject } from 'rxjs';
import { DbModelSourceConfig } from '../../../../../../../entity/model/database/source/config/db-model-source-config';
import { DatabaseModelSourceService } from '../../../../../../../service/model/database/source/db-model-source.service';
import { BaseComponent } from '../../../../../../base.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'db-model-source-config-editor',
  standalone: true,
  imports: [
    CommonModule,
    DbModelSourceConfigEditFormComponent,
    MenuSelectComponent
  ],
  templateUrl: './db-model-source-config-editor.component.html',
  styleUrl: './db-model-source-config-editor.component.scss'
})
export class DbModelSourceConfigEditorComponent extends BaseComponent implements OnInit {

  configForEdit$: BehaviorSubject<DbModelSourceConfig | undefined>;

  availableConfigs: DbModelSourceConfig[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private databaseModelSourceService: DatabaseModelSourceService
  ) {
    super();
    this.configForEdit$ = new BehaviorSubject<DbModelSourceConfig | undefined>( undefined );
    this.availableConfigs = [];
    this.showSelect = true;
    this.baseHtmlId = "dbModelSourceConfigEditor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
  }

  ngOnInit(): void {
    let availableConfigsSubscription = this.databaseModelSourceService.getConfigs().subscribe({
                                                                                              next: (configs: DbModelSourceConfig[] | undefined) => {
                                                                                                if (!configs) {
                                                                                                  throw new Error("Failed to load the available Database Model Source Configs");
                                                                                                }
                                                                                                this.availableConfigs = configs;
                                                                                              },
                                                                                              error: (err: any) => {
                                                                                                throw new Error( "Failed to load the available Database Model Source Configs due to [" + err + "]" );
                                                                                              },
                                                                                              complete: () => {
                                                                                                console.log("Finished loading the available Database Model Source Configs");
                                                                                              }
                                                                                            });
    this.addLongLivingSubscription(availableConfigsSubscription);
  }

  getAvailableConfigKeys(): string[] {
    return this.availableConfigs.map((config: DbModelSourceConfig) => {
      return config.id.toString();
    });
  }

  loadNewConfigForEdit(): void {
    this.setConfigForEdit(new DbModelSourceConfig());
    this.showSelect = false;
  }

  loadConfigForEdit( configIdSelected: string ): void {
    let configSelected = this.getConfigFromId(configIdSelected);
    if(!configSelected) {
      this.resetConfigEdit();
      throw new Error("Unable to find the Database Model Source Config using the ID [" + configIdSelected + "]");
    }
    this.setConfigForEdit(configSelected);
  }

  resetConfigEdit(): void {
    this.setConfigForEdit(undefined);
    this.showSelect = true;
  }

  private setConfigForEdit( configForEdit: DbModelSourceConfig | undefined ): void {
    this.configForEdit$.next(configForEdit);
    this.showSelect = false;
  }

  private getConfigFromId( configIdToFind: string ): DbModelSourceConfig | undefined {
    return this.availableConfigs.find((availableConfig: DbModelSourceConfig) => {
      return availableConfig.id.toString() === configIdToFind;
    });
  }

}
