import { Component, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../../../shared/modal/modal.component';
import { ModalService } from '../../../../../../../service/shared/modal/modal.service';
import { CodeModelSourceProjectEditFormComponent } from '../form/code-model-source-project-edit-form.component';
import { Observable, of } from 'rxjs';
import { CodeModelSourceProject } from '../../../../../../../entity/model/code/source/project/code-model-source-project';
import { ApiEntity } from '../../../../../../../entity/shared/api-entity';

export const ADD_PROJECT_MODAL_TITLE = "add project";
export const EDIT_PROJECT_MODAL_TITLE = "edit project";

@Component({
  selector: 'code-model-source-project-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    CodeModelSourceProjectEditFormComponent
],
  templateUrl: './code-model-source-project-edit-modal.component.html',
  styleUrl: './code-model-source-project-edit-modal.component.scss'
})
export class CodeModelSourceProjectEditModalComponent extends BaseComponent {

  @Input() baseHtmlId: string;

  @Input() projectForEditObservable: Observable< CodeModelSourceProject | undefined >;

  projectForEdit: CodeModelSourceProject | undefined;

  modalTitle: string;

  constructor(
    private modalService: ModalService
  ) {
    super();
    this.baseHtmlId = "";
    this.projectForEditObservable = of(undefined);

    this.modalTitle = "";
  }

  ngOnInit(): void {
    let projectForEditSubscription = this.projectForEditObservable.subscribe({
                                                                      next: (nextProjectForEdit: CodeModelSourceProject | undefined) => {
                                                                        this.setModalTitleForNextProject(nextProjectForEdit);
                                                                        this.projectForEdit = nextProjectForEdit;
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error( "Failed to load the next Code Model Source Project for edit due to [" + err + "]" );
                                                                      },
                                                                      complete: () => {
                                                                        console.log("Finished loading the next Code Model Source Project for edit");
                                                                      }
                                                                    });
    this.addLongLivingSubscription(projectForEditSubscription);
  }

  setModalTitleForNextProject(nextProjectForEdit: CodeModelSourceProject | undefined): void {
    if(this.isProjectNew(nextProjectForEdit)) {
      this.modalTitle = ADD_PROJECT_MODAL_TITLE;
    } else {
      this.modalTitle = EDIT_PROJECT_MODAL_TITLE;
    }
  }

  isProjectNew(projectToCheck: CodeModelSourceProject | undefined): boolean {
    return ApiEntity.isEntityNew(projectToCheck);
  }

  closeModal(): void {
    this.modalService.close();
  }

}
