import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../shared/base/base.component';
import { CodeModelSourceProject } from '../../../../../../../entity/model/code/source/project/code-model-source-project';
import { CodeModelSourceProjectCreateArgs } from '../../../../../../../entity/model/code/source/project/create/code-model-source-project-create-args';
import { FormGroup, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CodeModelSourceProjectService } from '../../../../../../../service/model/code/source/project/code-model-source-project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'code-model-source-project-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './code-model-source-project-edit-form.component.html',
  styleUrl: './code-model-source-project-edit-form.component.scss'
})
export class CodeModelSourceProjectEditFormComponent extends BaseComponent implements OnInit {

  @Input() projectForEditObservable: Observable<CodeModelSourceProject | undefined>;

  @Output() projectWasSavedEvent: EventEmitter<boolean>;

  @Output() cancelButtonClickedEvent: EventEmitter<boolean>;

  projectForEdit: CodeModelSourceProject | undefined;

  projectEditForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private codeModelSourceProjectService: CodeModelSourceProjectService
  ) {
    super();
    this.projectForEditObservable = of(undefined);
    this.projectWasSavedEvent = new EventEmitter<boolean>();
    this.cancelButtonClickedEvent = new EventEmitter<boolean>();

    this.projectForEdit = undefined;
    this.projectEditForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      path: new FormControl("", Validators.required)
    });
  }

  ngOnInit(): void {
    let projectToEditSubscription = this.projectForEditObservable.subscribe({
                                                                        next: (project: CodeModelSourceProject | undefined) => {
                                                                          this.setProjectForEdit(project);
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to load the Canvas for editing due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished loading the Canvas for editing");
                                                                        }
                                                                      });
    this.addLongLivingSubscription(projectToEditSubscription);
  }

  saveProject(): void {
    if (
      !this.projectEditForm
      || !this.projectEditForm.value
      || !this.projectEditForm.valid
    ) {
      throw new Error("Code Model Source Project Edit Form was invalid, unable to save");
    }

    if (!this.projectForEdit) {
      throw new Error("Code Model Source Project was undefined, unable to save");
    }

    if (this.isProjectNew(this.projectForEdit)) {
      let projectCreateArgs = new CodeModelSourceProjectCreateArgs();
      projectCreateArgs.name = this.projectEditForm.value.name;
      projectCreateArgs.path = this.projectEditForm.value.path;

      this.codeModelSourceProjectService.createProject(projectCreateArgs).subscribe({
                                                                            next: (createdProject: CodeModelSourceProject | undefined) => {
                                                                              if (!createdProject) {
                                                                                throw new Error("Failed to create the Code Model Source Project with name [" + projectCreateArgs.name + "] and path [" + projectCreateArgs.path + "]");
                                                                              }

                                                                              this.handleSuccessfulSave();
                                                                            },
                                                                            error: (err: any) => {
                                                                              throw new Error( "Failed to create the Code Model Source Project with name [" + projectCreateArgs.name + "] and path [" + projectCreateArgs.path + "] due to [" + err + "]" );
                                                                            },
                                                                            complete: () => {
                                                                              console.log("Finished create the Code Model Source Project with name [" + projectCreateArgs.name + "] and path [" + projectCreateArgs.path + "]");
                                                                            }
                                                                          });

    } else {
      let projectForUpdate = new CodeModelSourceProject();

      // this.codeModelProjectService.updateProject(projectForUpdate).subscribe({
      //                                                           next: (updatedProject: CodeProject | undefined) => {
      //                                                             if (!updatedProject) {
      //                                                               throw new Error("Failed to update the Code Project");
      //                                                             }
      //                                                             this.handleSuccessfulSave();
      //                                                           },
      //                                                           error: (err: any) => {
      //                                                             throw new Error("Failed to update the Code Project due to [" + err + "]");
      //                                                           },
      //                                                           complete: () => {
      //                                                             console.log("Finished updating the Code Project");
      //                                                           }
      //                                                         });
    }
  }

  isProjectNew(project: CodeModelSourceProject | undefined): boolean {
    let isProjectNew = false;
    if (project && project.isNewEntity()) {
      isProjectNew = true;
    }
    return isProjectNew;
  }

  resetEditForms(): void {
    this.projectEditForm.reset();
    this.projectForEdit = undefined;
  }

  handleSuccessfulSave(): void {
    this.resetEditForms();

    this.projectWasSavedEvent.emit(true);
  }

  cancelButtonClicked(): void {
    this.resetEditForms();

    this.cancelButtonClickedEvent.emit(true);
  }

  private setProjectForEdit(nextProjectForEdit: CodeModelSourceProject | undefined): void {
    if (nextProjectForEdit) {
      this.projectForEdit = nextProjectForEdit;

      this.setFormValues(nextProjectForEdit);
    }
  }

  private setFormValues(nextProjectForEdit: CodeModelSourceProject): void {
    this.projectEditForm.setValue({
      name: nextProjectForEdit.name,
      path: ""
    });
    }

}
