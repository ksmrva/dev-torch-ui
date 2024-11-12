import { Component, OnInit } from '@angular/core';
import { DbModelSourceConfigEditFormComponent } from "../form/db-model-source-config-edit-form.component";
import { MenuSelectComponent } from "../../../../../../edit/menu/select/menu-select.component";
import { BehaviorSubject } from 'rxjs';
import { DbModelSourceConfig } from '../../../../../../../entity/model/database/source/config/db-model-source-config';
import { DbModelSourceService } from '../../../../../../../service/model/database/source/db-model-source.service';
import { BaseComponent } from '../../../../../../base.component';
import { StringUtil } from '../../../../../../../entity/helper/string/util/string-util';
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

  sourceConfigForEdit$: BehaviorSubject<DbModelSourceConfig | undefined>;

  availableSourceConfigs: DbModelSourceConfig[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private dbModelSourceService: DbModelSourceService
  ) {
    super();
    this.sourceConfigForEdit$ = new BehaviorSubject<DbModelSourceConfig | undefined>( undefined );
    this.availableSourceConfigs = [];
    this.showSelect = true;
    this.baseHtmlId = "dbModelSourceConfigEditor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
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
  }

  getAvailableSourceConfigKeys(): string[] {
    return this.availableSourceConfigs.map((sourceConfig: DbModelSourceConfig) => {
      return sourceConfig.id.toString();
    });
  }

  loadNewSourceConfigForEdit(): void {
    this.setSourceConfigForEdit(new DbModelSourceConfig());
    this.showSelect = false;
  }

  loadSourceConfigForEdit( configIdSelected: string ): void {
    let sourceConfigSelected = this.getSourceConfigFromId(configIdSelected);
    if(!sourceConfigSelected) {
      this.resetSourceConfigEdit();
      throw new Error("Unable to find the Database Model Source Config using the key [" + configIdSelected + "]");
    }
    this.setSourceConfigForEdit(sourceConfigSelected);
  }

  resetSourceConfigEdit(): void {
    this.setSourceConfigForEdit(undefined);
    this.showSelect = true;
  }

  private setSourceConfigForEdit( sourceConfigForEdit: DbModelSourceConfig | undefined ): void {
    this.sourceConfigForEdit$.next(sourceConfigForEdit);
    this.showSelect = false;
  }

  private getSourceConfigFromId( idToFind: string ): DbModelSourceConfig | undefined {
    return this.availableSourceConfigs.find((availableSourceConfig: DbModelSourceConfig) => {
      return availableSourceConfig.id.toString() === idToFind;
    });
  }

}
