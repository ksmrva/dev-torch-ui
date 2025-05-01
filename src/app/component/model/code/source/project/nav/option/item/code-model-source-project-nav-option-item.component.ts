import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeModelSourceProjectService } from '../../../../../../../../service/model/code/source/project/code-model-source-project.service';
import { ModalService } from '../../../../../../../../service/shared/modal/modal.service';
import { CodeModelSourceProjectEditModalComponent } from '../../../edit/modal/code-model-source-project-edit-modal.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CodeModelSourceProject } from '../../../../../../../../entity/model/code/source/project/code-model-source-project';
import { StringUtil } from '../../../../../../../../entity/shared/string/util/string-util';
import { NavOptionItemComponent } from '../../../../../../../shared/nav/option/item/nav-option-item.component';

@Component({
  selector: 'code-model-source-project-nav-option-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionItemComponent,
    CodeModelSourceProjectEditModalComponent
  ],
  templateUrl: './code-model-source-project-nav-option-item.component.html',
  styleUrl: './code-model-source-project-nav-option-item.component.scss'
})
export class CodeModelSourceProjectNavOptionItemComponent extends BaseComponent implements OnInit {

  @Input() closeOptionItem: Observable<boolean>;

  @Output() optionItemOpenEvent: EventEmitter<boolean>;

  @Output() keySelectedEvent: EventEmitter<CodeModelSourceProject | undefined>;

  @Output() addNewEvent: EventEmitter<boolean>;

  selectedProject: CodeModelSourceProject | undefined;

  projectForEdit$: BehaviorSubject<CodeModelSourceProject | undefined>;

  availableProjectNames: string[];

  selectButtonTitle: string;

  navOptionBaseHtmlId: string;

  editModalBaseHtmlId: string;

  constructor(
    private modalService: ModalService,
    private codeModelSourceProjectService: CodeModelSourceProjectService
  ) {
    super();
    this.closeOptionItem = of(false);
    this.optionItemOpenEvent = new EventEmitter<boolean>();
    this.keySelectedEvent = new EventEmitter<CodeModelSourceProject | undefined>();
    this.addNewEvent = new EventEmitter<boolean>();

    this.selectedProject = undefined;
    this.projectForEdit$ = new BehaviorSubject<CodeModelSourceProject | undefined>( undefined );
    this.availableProjectNames = [];
    this.navOptionBaseHtmlId = "";
    this.selectButtonTitle = "";
    this.editModalBaseHtmlId = "";
  }

  ngOnInit(): void {
    this.selectButtonTitle = "project";
    this.navOptionBaseHtmlId = "codeModelSourceProjectNavOptionItem";
    this.editModalBaseHtmlId = this.navOptionBaseHtmlId + "_ProjectEditModal";

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

    let availableProjectNamesSubscription = this.codeModelSourceProjectService.getProjectNames().subscribe({
                                                                                                  next: (projectNames: string[] | undefined) => {
                                                                                                    if (!projectNames) {
                                                                                                      throw new Error("Failed to get the available Code Model Source Project Names");
                                                                                                    }
                                                                                                    this.availableProjectNames = projectNames;
                                                                                                  },
                                                                                                  error: (err: any) => {
                                                                                                    throw new Error( "Failed to load the available Code Model Source Project Names due to [" + err + "]" );
                                                                                                  },
                                                                                                  complete: () => {
                                                                                                    console.log("Finished loading the available Code Model Source Project Names");
                                                                                                  }
                                                                                                });
    this.addLongLivingSubscription(availableProjectNamesSubscription);
  }

  loadNewProjectForEdit(): void {
    this.projectForEdit$.next(new CodeModelSourceProject());

    this.openEditModal();
    this.addNewEvent.emit(true);
  }

  loadSelectedProjectForEdit(): void {
    if(this.selectedProject) {
      this.projectForEdit$.next(this.selectedProject);

      this.openEditModal();
    } else {
      console.warn("No Code Model Source Project selected, therefore the Edit can not be opened");
    }
  }

  projectSelected(selectedProjectName: string | undefined): void {
    if (selectedProjectName
      && StringUtil.isNotEmpty(selectedProjectName)) {
      this.codeModelSourceProjectService.getProject(selectedProjectName).subscribe({
                                                                            next: (nextSelectedProject: CodeModelSourceProject | undefined) => {
                                                                              if (!nextSelectedProject) {
                                                                                throw new Error( "Failed to load the selected Code Model Source Project using Name [" + selectedProjectName + "]" );
                                                                              }
                                                                              this.selectedProject = nextSelectedProject;
                                                                              this.keySelectedEvent.emit(nextSelectedProject);
                                                                            },
                                                                            error: (err: any) => {
                                                                              throw new Error( "Failed to load the selected Code Model Source Project using Name [" + selectedProjectName + "] due to [" + err + "]" );
                                                                            },
                                                                            complete: () => {
                                                                              console.log( "Finished loading the selected Code Model Source Project using Name [" + selectedProjectName + "]" );
                                                                            }
                                                                          });
    } else {
      console.warn( "Was provided an undefined or empty Code Model Source Project Name" );
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
