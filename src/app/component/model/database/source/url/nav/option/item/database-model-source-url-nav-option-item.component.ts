import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatabaseModelSourceUrlEditModalComponent } from '../../../edit/modal/database-model-source-url-edit-modal.component';
import { BaseComponent } from '../../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DbModelSourceUrl } from '../../../../../../../../entity/model/database/source/url/db-model-source-url';
import { StringUtil } from '../../../../../../../../entity/shared/string/util/string-util';
import { DatabaseModelSourceService } from '../../../../../../../../service/model/database/source/db-model-source.service';
import { ModalService } from '../../../../../../../../service/shared/modal/modal.service';
import { NavOptionItemComponent } from '../../../../../../../shared/nav/option/item/nav-option-item.component';

@Component({
  selector: 'database-model-source-url-nav-option-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionItemComponent,
    DatabaseModelSourceUrlEditModalComponent
  ],
  templateUrl: './database-model-source-url-nav-option-item.component.html',
  styleUrl: './database-model-source-url-nav-option-item.component.scss'
})
export class DatabaseModelSourceUrlNavOptionItemComponent extends BaseComponent implements OnInit {

  @Input() closeOptionItem: Observable<boolean>;

  @Output() optionItemOpenEvent: EventEmitter<boolean>;

  @Output() keySelectedEvent: EventEmitter<DbModelSourceUrl | undefined>;

  @Output() addNewEvent: EventEmitter<boolean>;

  selectedUrl: DbModelSourceUrl | undefined;

  urlForEdit$: BehaviorSubject<DbModelSourceUrl | undefined>;

  availableUrls: DbModelSourceUrl[];

  selectButtonTitle: string;

  baseHtmlId: string;

  editModalBaseHtmlId: string;

  constructor(
    private modalService: ModalService,
    private databaseModelSourceService: DatabaseModelSourceService
  ) {
    super();
    this.closeOptionItem = of(false);
    this.optionItemOpenEvent = new EventEmitter<boolean>();
    this.keySelectedEvent = new EventEmitter<DbModelSourceUrl | undefined>();
    this.addNewEvent = new EventEmitter<boolean>();

    this.selectedUrl = undefined;
    this.urlForEdit$ = new BehaviorSubject<DbModelSourceUrl | undefined>( undefined );
    this.availableUrls = [];
    this.baseHtmlId = "";
    this.selectButtonTitle = "";
    this.editModalBaseHtmlId = "";
  }

  ngOnInit(): void {
    this.selectButtonTitle = "url";
    this.baseHtmlId = "databaseModelSourceUrlNavOptionItem";
    this.editModalBaseHtmlId = this.baseHtmlId + "_UrlEditModal";

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

    let availableUrlsSubscription = this.databaseModelSourceService.getUrls().subscribe({
                                                                                  next: (nextUrls: DbModelSourceUrl[] | undefined) => {
                                                                                    if (!nextUrls) {
                                                                                      throw new Error("Failed to get the available Database Model Source URLs");
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
  }

  getAvailableUrlNames(): string[] {
    let availableUrlNames: string[] = [];
    if(this.availableUrls) {
      this.availableUrls.forEach((url: DbModelSourceUrl) => {
        availableUrlNames.push(url.toString());
      });
    }
    return availableUrlNames;
  }

  loadNewUrlForEdit(): void {
    this.urlForEdit$.next(new DbModelSourceUrl());

    this.openEditModal();
    this.addNewEvent.emit(true);
  }

  loadSelectedUrlForEdit(): void {
    if(this.selectedUrl) {
      this.urlForEdit$.next(this.selectedUrl);

      this.openEditModal();
    } else {
      console.warn("No Database Model Source URL selected, therefore the Edit can not be opened");
    }
  }

  urlSelected(selectedUrlName: string | undefined): void {
    if (selectedUrlName
      && StringUtil.isNotEmpty(selectedUrlName)) {
        if(!this.availableUrls || this.availableUrls.length === 0) {
            throw new Error("Database Model Source URL Name [" + selectedUrlName + "] was provided for selection, but there were no Available URLs");
        }

        let urlFound = this.availableUrls.find((availableUrl: DbModelSourceUrl) => {
          return availableUrl.toString() === selectedUrlName;
        });

        if(!urlFound) {
          throw new Error("Database Model Source URL Name [" + selectedUrlName + "] was provided for selection, but the URL could not be found in the Available URLs Array");
        }

        this.selectedUrl = urlFound;

    } else {
      console.warn( "Was provided an undefined or empty Database Model Source URL Name" );
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
