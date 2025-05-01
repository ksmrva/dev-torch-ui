import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Observable, of } from "rxjs";
import { CodeModelSourceProject } from "../../../../../../../../entity/model/code/source/project/code-model-source-project";
import { BaseComponent } from "../../../../../../../shared/base/base.component";
import { NavOptionGroupComponent } from "../../../../../../../shared/nav/option/group/nav-option-group.component";
import { CodeModelSourceProjectNavOptionItemComponent } from "../../../../project/nav/option/item/code-model-source-project-nav-option-item.component";

@Component({
  selector: 'code-model-source-nav-option-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavOptionGroupComponent,
    CodeModelSourceProjectNavOptionItemComponent
  ],
  templateUrl: './code-model-source-nav-option-group.component.html',
  styleUrl: './code-model-source-nav-option-group.component.scss'
})
export class CodeModelSourceNavOptionGroupComponent extends BaseComponent implements OnInit {

  @Input() closeAllOptionsObservable: Observable<boolean>;

  @Output() projectOptionOpenEvent: EventEmitter<boolean>;

  @Output() projectSelectedEvent: EventEmitter<CodeModelSourceProject | undefined>;

  @Output() toggleOptionsEvent: EventEmitter<boolean>;

  groupTitle: string;

  baseHtmlId: string;

  showOptions: boolean;

  constructor() {
    super();
    this.closeAllOptionsObservable = of(true);
    this.projectOptionOpenEvent = new EventEmitter<boolean>();
    this.projectSelectedEvent = new EventEmitter<CodeModelSourceProject | undefined>();
    this.toggleOptionsEvent = new EventEmitter<boolean>();

    this.groupTitle = "";
    this.baseHtmlId = "";
    this.showOptions = false;
  }

  ngOnInit(): void {
    let closeAllOptionsSubscription = this.closeAllOptionsObservable.subscribe({
                                                                            next: (shouldCloseOptions: boolean) => {
                                                                              if(shouldCloseOptions) {
                                                                                this.closeOptions();
                                                                              }
                                                                            },
                                                                            error: (err: any) => {
                                                                              throw new Error( "Failed to receive command to close all Options due to [" + err + "]" );
                                                                            },
                                                                            complete: () => {
                                                                              console.log( "Finished receiving command to close all Options" );
                                                                            }
                                                                          });
    this.addLongLivingSubscription(closeAllOptionsSubscription);

    this.groupTitle = "source";
    this.baseHtmlId = "codeModelSourceNavOptionGroup";
    this.closeOptions();
  }

  handleProjectOptionOpen(projectOptionOpen: boolean): void {
    this.projectOptionOpenEvent.emit(projectOptionOpen);
  }

  handleNewProjectAddEvent(newProjectIsBeingAdded: boolean): void {
    if(newProjectIsBeingAdded) {
      this.closeOptions();
    }
  }

  handleToggleOptionsEvent(optionsOpen: boolean): void {
    this.toggleOptionsEvent.emit(optionsOpen);
  }

  projectSelected(selectedProject: CodeModelSourceProject | undefined): void {
    this.projectSelectedEvent.emit(selectedProject);
  }

  openOptions(): void {
    this.showOptions = true;
  }

  closeOptions(): void {
    this.showOptions = false;
    this.closeProjectOptions();
  }

  closeProjectOptions(): void {
    this.projectOptionOpenEvent.emit(false);
    this.projectSelectedEvent.emit(undefined);
  }

}
