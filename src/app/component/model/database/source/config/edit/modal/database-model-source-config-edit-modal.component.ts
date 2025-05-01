import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ModalService } from '../../../../../../../service/shared/modal/modal.service';
import { ModalComponent } from '../../../../../../shared/modal/modal.component';
import { ADD_PROJECT_MODAL_TITLE, EDIT_PROJECT_MODAL_TITLE } from '../../../../../code/source/project/edit/modal/code-model-source-project-edit-modal.component';
import { DatabaseModelSourceConfigEditFormComponent } from '../form/database-model-source-config-edit-form.component';
import { DbModelSourceConfig } from '../../../../../../../entity/model/database/source/config/db-model-source-config';
import { ApiEntity } from '../../../../../../../entity/shared/api-entity';

@Component({
  selector: 'database-model-source-config-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    DatabaseModelSourceConfigEditFormComponent
  ],
  templateUrl: './database-model-source-config-edit-modal.component.html',
  styleUrl: './database-model-source-config-edit-modal.component.scss'
})
export class DatabaseModelSourceConfigEditModalComponent extends BaseComponent {

  @Input() baseHtmlId: string;

  @Input() configForEditObservable: Observable< DbModelSourceConfig | undefined >;

  configForEdit: DbModelSourceConfig | undefined;

  modalTitle: string;

  constructor(
    private modalService: ModalService
  ) {
    super();
    this.baseHtmlId = "";
    this.configForEditObservable = of(undefined);

    this.modalTitle = "";
  }

  ngOnInit(): void {
    let configForEditSubscription = this.configForEditObservable.subscribe({
                                                                    next: (nextConfigForEdit: DbModelSourceConfig | undefined) => {
                                                                      this.setModalTitleForNextConfig(nextConfigForEdit);
                                                                      this.configForEdit = nextConfigForEdit;
                                                                    },
                                                                    error: (err: any) => {
                                                                      throw new Error( "Failed to load the next Database Model Source Config for editing due to [" + err + "]" );
                                                                    },
                                                                    complete: () => {
                                                                      console.log("Finished loading the next Database Model Source Config for editing");
                                                                    }
                                                                  });
    this.addLongLivingSubscription(configForEditSubscription);
  }

  setModalTitleForNextConfig(nextConfigForEdit: DbModelSourceConfig | undefined): void {
    if(this.isConfigNew(nextConfigForEdit)) {
      this.modalTitle = ADD_PROJECT_MODAL_TITLE;
    } else {
      this.modalTitle = EDIT_PROJECT_MODAL_TITLE;
    }
  }

  isConfigNew(configToCheck: DbModelSourceConfig | undefined): boolean {
    return ApiEntity.isEntityNew(configToCheck);
  }

  closeModal(): void {
    this.modalService.close();
  }

}
