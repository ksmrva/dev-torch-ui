import { Component, Input } from '@angular/core';
import { DatabaseModelSourceUrlEditFormComponent } from '../form/database-model-source-url-edit-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApiEntity } from '../../../../../../../entity/shared/api-entity';
import { ModalService } from '../../../../../../../service/shared/modal/modal.service';
import { ModalComponent } from '../../../../../../shared/modal/modal.component';
import { BaseComponent } from '../../../../../../shared/base/base.component';
import { DbModelSourceUrl } from '../../../../../../../entity/model/database/source/url/db-model-source-url';

export const ADD_URL_MODAL_TITLE = "add url";
export const EDIT_URL_MODAL_TITLE = "edit url";

@Component({
  selector: 'database-model-source-url-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    DatabaseModelSourceUrlEditFormComponent
  ],
  templateUrl: './database-model-source-url-edit-modal.component.html',
  styleUrl: './database-model-source-url-edit-modal.component.scss'
})
export class DatabaseModelSourceUrlEditModalComponent extends BaseComponent {

  @Input() baseHtmlId: string;

  @Input() urlForEditObservable: Observable< DbModelSourceUrl | undefined >;

  urlForEdit: DbModelSourceUrl | undefined;

  modalTitle: string;

  constructor(
    private modalService: ModalService
  ) {
    super();
    this.baseHtmlId = "";
    this.urlForEditObservable = of(undefined);

    this.modalTitle = "";
  }

  ngOnInit(): void {
    let urlForEditSubscription = this.urlForEditObservable.subscribe({
                                                                    next: (nextUrlForEdit: DbModelSourceUrl | undefined) => {
                                                                      this.setModalTitleForNextUrl(nextUrlForEdit);
                                                                      this.urlForEdit = nextUrlForEdit;
                                                                    },
                                                                    error: (err: any) => {
                                                                      throw new Error( "Failed to load the next Database Model Source URL for editing due to [" + err + "]" );
                                                                    },
                                                                    complete: () => {
                                                                      console.log("Finished loading the next Database Model Source URL for editing");
                                                                    }
                                                                  });
    this.addLongLivingSubscription(urlForEditSubscription);
  }

  setModalTitleForNextUrl(nextUrlForEdit: DbModelSourceUrl | undefined): void {
    if(this.isUrlNew(nextUrlForEdit)) {
      this.modalTitle = ADD_URL_MODAL_TITLE;
    } else {
      this.modalTitle = EDIT_URL_MODAL_TITLE;
    }
  }

  isUrlNew(urlToCheck: DbModelSourceUrl | undefined): boolean {
    return ApiEntity.isEntityNew(urlToCheck);
  }

  closeModal(): void {
    this.modalService.close();
  }

}
