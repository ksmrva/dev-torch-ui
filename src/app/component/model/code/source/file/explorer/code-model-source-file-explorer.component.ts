import { CommonModule } from "@angular/common";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CodeModelSourceProject } from "../../../../../../entity/model/code/source/project/code-model-source-project";
import { CodeModelSourceProjectService } from "../../../../../../service/model/code/source/project/code-model-source-project.service";
import { BaseComponent } from "../../../../../base.component";
import { CodeModelSourceFileExplorerEntryComponent } from "./entry/code-model-source-file-explorer-entry.component";
import { CodeModelSourceFileTreeNode } from "../../../../../../entity/model/code/source/file/tree/node/code-model-source-file-tree-node";

@Component({
  selector: 'code-model-source-file-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CodeModelSourceFileExplorerEntryComponent
],
  templateUrl: './code-model-source-file-explorer.component.html',
  styleUrl: './code-model-source-file-explorer.component.scss'
})
export class CodeModelSourceFileExplorerComponent extends BaseComponent implements OnInit {

  @Output() entryClicked: EventEmitter<CodeModelSourceFileTreeNode>;

  projectNames: string[];

  selectedProjectName: string | undefined;

  selectedProject: CodeModelSourceProject | undefined;

  constructor(
    private codeModelProjectService: CodeModelSourceProjectService
  ) {
    super();
    this.entryClicked = new EventEmitter<CodeModelSourceFileTreeNode>();

    this.projectNames = [];
    this.selectedProjectName = "";
    this.selectedProject = undefined;
  }

  ngOnInit(): void {
    let codeProjectNamesSubscription = this.codeModelProjectService.getProjectNames().subscribe({
                                                                                  next: (allProjectNames: string[]) => {
                                                                                    if(allProjectNames) {
                                                                                      this.projectNames = allProjectNames
                                                                                    }
                                                                                  },
                                                                                  error: (err: any) => {
                                                                                    throw new Error( "Failed to load the Code Project Names due to [" + err + "]" );
                                                                                  },
                                                                                  complete: () => {
                                                                                    console.log("Finished loading the Code Project Names");
                                                                                  }
                                                                                });
    this.addLongLivingSubscription(codeProjectNamesSubscription);
  }

  handleClickedEntry(clickedEntry: CodeModelSourceFileTreeNode): void {
    this.entryClicked.emit(clickedEntry);
  }

  selectProject(): void {
    if(this.selectedProjectName !== undefined) {
      this.codeModelProjectService.getProject(this.selectedProjectName).subscribe({
                                                                              next: (project: CodeModelSourceProject | undefined) => {
                                                                                if (!project) {
                                                                                  throw new Error("Failed to get the Code Project using Name [" + this.selectedProjectName + "]");
                                                                                }
                                                                                this.selectedProject = project;
                                                                              },
                                                                              error: (err: any) => {
                                                                                throw new Error("Failed to get the Code Project using Name [" + this.selectedProjectName + "] due to [" + err + "]");
                                                                              },
                                                                              complete: () => {
                                                                                console.log("Finished getting the Code Project");
                                                                              }
      });
    }
  }

}
