import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DbModelSourceConfig } from '../../../../../../../../entity/model/database/source/config/db-model-source-config';
import { DatabaseModelSourceService } from '../../../../../../../../service/model/database/source/db-model-source.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StringUtil } from '../../../../../../../../entity/shared/string/util/string-util';
import { ModalService } from '../../../../../../../../service/shared/modal/modal.service';
import { BaseComponent } from '../../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavOptionItemComponent } from '../../../../../../../shared/nav/option/item/nav-option-item.component';
import { DatabaseModelSourceConfigEditModalComponent } from '../../../edit/modal/database-model-source-config-edit-modal.component';

@Component({
  selector: 'database-model-source-config-nav-option-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionItemComponent,
    DatabaseModelSourceConfigEditModalComponent
  ],
  templateUrl: './database-model-source-config-nav-option-item.component.html',
  styleUrl: './database-model-source-config-nav-option-item.component.scss'
})
export class DatabaseModelSourceConfigNavOptionItemComponent extends BaseComponent implements OnInit {

  @Input() closeOptionItem: Observable<boolean>;

  @Output() optionItemOpenEvent: EventEmitter<boolean>;

  @Output() keySelectedEvent: EventEmitter<DbModelSourceConfig | undefined>;

  @Output() addNewEvent: EventEmitter<boolean>;

  selectedConfig: DbModelSourceConfig | undefined;

  configForEdit$: BehaviorSubject<DbModelSourceConfig | undefined>;

  availableConfigs: DbModelSourceConfig[];

  selectButtonTitle: string;

  navOptionBaseHtmlId: string;

  editModalBaseHtmlId: string;

  constructor(
    private modalService: ModalService,
    private databaseModelSourceService: DatabaseModelSourceService
  ) {
    super();
    this.closeOptionItem = of(false);
    this.optionItemOpenEvent = new EventEmitter<boolean>();
    this.keySelectedEvent = new EventEmitter<DbModelSourceConfig | undefined>();
    this.addNewEvent = new EventEmitter<boolean>();

    this.selectedConfig = undefined;
    this.configForEdit$ = new BehaviorSubject<DbModelSourceConfig | undefined>( undefined );
    this.availableConfigs = [];
    this.navOptionBaseHtmlId = "";
    this.selectButtonTitle = "";
    this.editModalBaseHtmlId = "";
  }

  ngOnInit(): void {
    let closeOptionItemSubscription = this.closeOptionItem.subscribe({
                                                              next: (closeOptionItem: boolean) => {
                                                                if(closeOptionItem) {
                                                                  this.closeEditModal();
                                                                }
                                                              },
                                                              error: (err: any) => {
                                                                throw new Error( "Failed to receive the command to close the Option Item due to [" + err + "]" );
                                                              },
                                                              complete: () => {
                                                                console.log("Finished receiving the command to close the Option Item");
                                                              }
                                                            });
    this.addLongLivingSubscription(closeOptionItemSubscription);

    let availableConfigsSubscription = this.databaseModelSourceService.getConfigs().subscribe({
                                                                                        next: (nextConfigs: DbModelSourceConfig[] | undefined) => {
                                                                                          if (!nextConfigs) {
                                                                                            throw new Error("Failed to get the available Database Model Source Configs");
                                                                                          }
                                                                                          this.availableConfigs = nextConfigs;
                                                                                        },
                                                                                        error: (err: any) => {
                                                                                          throw new Error( "Failed to load the available Database Model Source Configs due to [" + err + "]" );
                                                                                        },
                                                                                        complete: () => {
                                                                                          console.log("Finished loading the available Database Model Source Configs");
                                                                                        }
                                                                                      });
    this.addLongLivingSubscription(availableConfigsSubscription);

    this.selectButtonTitle = "config";
    this.navOptionBaseHtmlId = "databaseModelSourceConfigNavOptionItem";
    this.editModalBaseHtmlId = this.navOptionBaseHtmlId + "_ConfigEditModal";
  }

  getAvailableConfigIds(): string[] {
    let availableConfigIds: string[] = [];
    if(this.availableConfigs) {
      this.availableConfigs.forEach((config: DbModelSourceConfig) => {
        availableConfigIds.push(config.id.toString());
      });
    }
    return availableConfigIds;
  }

  loadNewConfigForEdit(): void {
    this.configForEdit$.next(new DbModelSourceConfig());

    this.openEditModal();
    this.addNewEvent.emit(true);
  }

  loadSelectedConfigForEdit(): void {
    if(this.selectedConfig) {
      this.configForEdit$.next(this.selectedConfig);

      this.openEditModal();
    } else {
      console.warn("No Database Model Source Config selected, therefore the Edit can not be opened");
    }
  }

  configSelected(selectedConfigId: string | undefined): void {
    if (selectedConfigId
      && StringUtil.isNotEmpty(selectedConfigId)) {
        if(!this.availableConfigs || this.availableConfigs.length === 0) {
            throw new Error("Database Model Source Config ID [" + selectedConfigId + "] was provided for selection, but there were no Available Configs");
        }

        let selectedConfigIdNumber = Number(selectedConfigId)
        if(!selectedConfigIdNumber) {
          throw new Error("Database Model Source Config ID [" + selectedConfigId + "] was provided for selection, but the ID could not be converted into a Number");
        }

        let configFound = this.availableConfigs.find((availableConfig: DbModelSourceConfig) => {
          return availableConfig.id === selectedConfigIdNumber;
        });

        if(!configFound) {
          throw new Error("Database Model Source Config ID [" + selectedConfigId + "] was provided for selection, but the Config could not be found in the Available Configs Array");
        }

        this.selectedConfig = configFound;

    } else {
      console.warn( "Was provided an undefined or empty Database Model Source Config ID" );
    }
  }

  handleOptionItemOpenEvent(isOptionItemOpen: boolean): void {
    this.optionItemOpenEvent.emit(isOptionItemOpen);
  }

  openEditModal(): void {
    this.modalService.open(this.editModalBaseHtmlId);
  }

  closeEditModal(): void {
    this.modalService.close();
  }

}
