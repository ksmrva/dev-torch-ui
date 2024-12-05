import { Component, OnInit } from '@angular/core';
import { CodeModelSourceProjectEditFormComponent } from "../form/code-model-source-project-edit-form.component";
import { MenuSelectComponent } from "../../../../../../edit/menu/select/menu-select.component";
import { BaseComponent } from '../../../../../../base.component';
import { CodeModelSourceProjectService } from '../../../../../../../service/model/code/source/project/code-model-source-project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { StringUtil } from '../../../../../../../entity/helper/string/util/string-util';
import { CodeModelSourceProject } from '../../../../../../../entity/model/code/source/project/code-model-source-project';

@Component({
  selector: 'code-model-source-project-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CodeModelSourceProjectEditFormComponent,
    MenuSelectComponent
  ],
  templateUrl: './code-model-source-project-editor.component.html',
  styleUrl: './code-model-source-project-editor.component.scss'
})
export class CodeModelSourceProjectEditorComponent extends BaseComponent implements OnInit {

  projectForEdit$: BehaviorSubject<CodeModelSourceProject | undefined>;

  availableProjectNames: string[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private codeModelProjectService: CodeModelSourceProjectService
  ) {
    super();
    this.projectForEdit$ = new BehaviorSubject<CodeModelSourceProject | undefined>( undefined );
    this.availableProjectNames = [];
    this.showSelect = true;
    this.baseHtmlId = "codeModelSourceProject_Editor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
  }

  ngOnInit(): void {
    let availableProjectNamesSubscription = this.codeModelProjectService.getProjectNames().subscribe({
                                                                                                  next: (projectNames: string[] | undefined) => {
                                                                                                    if (!projectNames) {
                                                                                                      throw new Error("Failed to get the available Code Project Names");
                                                                                                    }
                                                                                                    this.availableProjectNames = projectNames;
                                                                                                  },
                                                                                                  error: (err: any) => {
                                                                                                    throw new Error( "Failed to load the available Code Project Names due to [" + err + "]" );
                                                                                                  },
                                                                                                  complete: () => {
                                                                                                    console.log("Finished loading the available Code Project Names");
                                                                                                  }
                                                                                                });
    this.addLongLivingSubscription(availableProjectNamesSubscription);
  }

  loadNewProjectForEdit(): void {
    this.setProjectForEdit(new CodeModelSourceProject());
    this.showSelect = false;
  }

  loadProjectForEdit(projectNameSelected: string): void {
    if (StringUtil.isNotEmpty(projectNameSelected)) {
      this.codeModelProjectService.getProject(projectNameSelected).subscribe({
                                                                  next: (loadedProject: CodeModelSourceProject | undefined) => {
                                                                    if (!loadedProject) {
                                                                      throw new Error( "Failed to load Code Project for editing using Name [" + projectNameSelected + "]" );
                                                                    }
                                                                    this.setProjectForEdit(loadedProject);
                                                                  },
                                                                  error: (err: any) => {
                                                                    throw new Error( "Failed to load Code Project for editing using Name [" + projectNameSelected + "] due to [" + err + "]" );
                                                                  },
                                                                  complete: () => {
                                                                    console.log( "Finished loading the Code Project for editing using Name [" + projectNameSelected + "]" );
                                                                  }
                                                                });
    } else {
      console.error( "No Code Project Name was selected, unable to load for editing" );
    }
  }

  resetEdit(): void {
    this.setProjectForEdit(undefined);
    this.showSelect = true;
  }

  private setProjectForEdit(projectForEdit: CodeModelSourceProject | undefined): void {
    this.projectForEdit$.next(projectForEdit);
    this.showSelect = false;
  }

}
