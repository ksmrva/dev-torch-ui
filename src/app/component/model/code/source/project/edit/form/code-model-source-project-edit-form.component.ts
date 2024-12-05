import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../base.component';
import { CodeModelSourceProject } from '../../../../../../../entity/model/code/source/project/code-model-source-project';
import { CodeModelSourceProjectCreateArgs } from '../../../../../../../entity/model/code/source/project/create/code-model-source-project-create-args';
import { FormGroup, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
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

  @Output() projectWasUpdated: EventEmitter<boolean>;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  projectEditForm: FormGroup;

  projectForEdit: CodeModelSourceProject | undefined;

  projectForEdit$: BehaviorSubject<CodeModelSourceProject | undefined>;

  constructor(
    private codeModelSourceProjectService: CodeModelSourceProjectService,
    formBuilder: FormBuilder
  ) {
    super();
    this.projectForEditObservable = of(undefined);
    this.projectWasUpdated = new EventEmitter<boolean>();
    this.resetEditButtonClicked = new EventEmitter<boolean>();

    this.projectEditForm = formBuilder.group({
      name: new FormControl("", Validators.required),
      path: new FormControl("", Validators.required)
    });

    this.projectForEdit = undefined;
    this.projectForEdit$ = new BehaviorSubject<CodeModelSourceProject | undefined>( undefined );
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
      // TODO: handle error
    }
    if (this.projectForEdit) {
      if (
        this.projectForEdit.id !== null
        && this.projectForEdit.id !== undefined
        && this.projectForEdit.id >= 0
      ) {
        let projectForUpdate = new CodeModelSourceProject();

        // this.codeModelProjectService.updateProject(projectForUpdate).subscribe({
        //                                                           next: (updatedProject: CodeProject | undefined) => {
        //                                                             if (!updatedProject) {
        //                                                               throw new Error("Failed to update the Code Project");
        //                                                             }
        //                                                             this.resetProjectAfterSave();
        //                                                           },
        //                                                           error: (err: any) => {
        //                                                             throw new Error("Failed to update the Code Project due to [" + err + "]");
        //                                                           },
        //                                                           complete: () => {
        //                                                             console.log("Finished updating the Code Project");
        //                                                           }
        //                                                         });

      } else {
        let projectCreateArgs = new CodeModelSourceProjectCreateArgs();
        projectCreateArgs.name = this.projectEditForm.value.name;
        projectCreateArgs.path = this.projectEditForm.value.path;

        this.codeModelSourceProjectService.createProject(projectCreateArgs).subscribe({
                                                                              next: (createdProject: CodeModelSourceProject | undefined) => {
                                                                                if (createdProject) {
                                                                                  this.resetProjectAfterSave();
                                                                                } else {
                                                                                  throw new Error("Failed to create the Code Model Source Project with name [" + projectCreateArgs.name + "] and path [" + projectCreateArgs.path + "]");
                                                                                }
                                                                              },
                                                                              error: (err: any) => {
                                                                                throw new Error( "Failed to create the Code Model Source Project with name [" + projectCreateArgs.name + "] and path [" + projectCreateArgs.path + "] due to [" + err + "]" );
                                                                              },
                                                                              complete: () => {
                                                                                console.log("Finished create the Code Model Source Project with name [" + projectCreateArgs.name + "] and path [" + projectCreateArgs.path + "]");
                                                                              }
                                                                            });
      }
    }
  }

  isProjectNew(project: CodeModelSourceProject | undefined): boolean {
    let isProjectNew = false;
    if (project && project.isNewEntity()) {
      isProjectNew = true;
    }
    return isProjectNew;
  }

  resetProjectAfterSave(): void {
    this.resetEditForms();

    this.projectWasUpdated.emit(true);
  }

  resetEdit(): void {
    this.resetEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  resetEditForms(): void {
    this.projectEditForm.reset();
    this.projectForEdit = undefined;
  }

  private setProjectForEdit(projectForEdit: CodeModelSourceProject | undefined): void {
    if (projectForEdit) {
      this.projectEditForm.setValue({
        name: projectForEdit.name,
        path: ""
      });
      this.projectForEdit = projectForEdit;
    }
  }

}
