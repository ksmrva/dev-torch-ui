import { Component, Input } from '@angular/core';
import { SqlDatabaseDetailEditFormComponent } from '../form/sql-database-detail-edit-form.component';
import { BaseComponent } from '../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApiEntity } from '../../../../../../../entity/shared/api-entity';
import { ModalService } from '../../../../../../../service/shared/modal/modal.service';
import { ModalComponent } from '../../../../../../shared/modal/modal.component';
import { ADD_PROJECT_MODAL_TITLE, EDIT_PROJECT_MODAL_TITLE } from '../../../../../code/source/project/edit/modal/code-model-source-project-edit-modal.component';
import { SqlDatabaseDetail } from '../../../../../../../entity/model/database/detail/sql/sql-database-detail';

@Component({
  selector: 'sql-database-detail-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    SqlDatabaseDetailEditFormComponent
  ],
  templateUrl: './sql-database-detail-edit-modal.component.html',
  styleUrl: './sql-database-detail-edit-modal.component.scss'
})
export class SqlDatabaseDetailEditModalComponent extends BaseComponent {

  @Input() baseHtmlId: string;

  @Input() detailForEditObservable: Observable< SqlDatabaseDetail | undefined >;

  detailForEdit: SqlDatabaseDetail | undefined;

  modalTitle: string;

  constructor(
    private modalService: ModalService
  ) {
    super();
    this.baseHtmlId = "";
    this.detailForEditObservable = of(undefined);

    this.modalTitle = "";
  }

  ngOnInit(): void {
    let detailForEditSubscription = this.detailForEditObservable.subscribe({
                                                                    next: (nextDetailForEdit: SqlDatabaseDetail | undefined) => {
                                                                      this.setModalTitleForNextDetail(nextDetailForEdit);
                                                                      this.detailForEdit = nextDetailForEdit;
                                                                    },
                                                                    error: (err: any) => {
                                                                      throw new Error( "Failed to load the next SQL Database Detail for editing due to [" + err + "]" );
                                                                    },
                                                                    complete: () => {
                                                                      console.log("Finished loading the next SQL Database Detail for editing");
                                                                    }
                                                                  });
    this.addLongLivingSubscription(detailForEditSubscription);
  }

  setModalTitleForNextDetail(nextDetailForEdit: SqlDatabaseDetail | undefined): void {
    if(this.isDetailNew(nextDetailForEdit)) {
      this.modalTitle = ADD_PROJECT_MODAL_TITLE;
    } else {
      this.modalTitle = EDIT_PROJECT_MODAL_TITLE;
    }
  }

  isDetailNew(detailToCheck: SqlDatabaseDetail | undefined): boolean {
    return ApiEntity.isEntityNew(detailToCheck);
  }

  closeModal(): void {
    this.modalService.close();
  }

}
