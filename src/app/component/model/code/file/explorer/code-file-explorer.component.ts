import { CommonModule } from "@angular/common";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CodeProject } from "../../../../../entity/model/code/project/code-project";
import { CodeModelProjectService } from "../../../../../service/model/code/project/code-model-project.service";
import { BaseComponent } from "../../../../base.component";
import { CodeFileExplorerEntryComponent } from "./entry/code-file-explorer-entry.component";
import { CodeFileNode } from "../../../../../entity/model/code/file/node/code-file-node";

@Component({
  selector: 'code-file-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CodeFileExplorerEntryComponent
],
  templateUrl: './code-file-explorer.component.html',
  styleUrl: './code-file-explorer.component.scss'
})
export class CodeFileExplorerComponent extends BaseComponent implements OnInit {

  @Output() entryClicked: EventEmitter<CodeFileNode>;

  projectNames: string[];

  selectedProjectName: string | undefined;

  selectedProject: CodeProject | undefined;

  constructor(
    private codeModelProjectService: CodeModelProjectService
  ) {
    super();
    this.entryClicked = new EventEmitter<CodeFileNode>();

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

  handleClickedEntry(clickedEntry: CodeFileNode): void {
    this.entryClicked.emit(clickedEntry);
  }

  selectProject(): void {
    if(this.selectedProjectName !== undefined) {
      this.codeModelProjectService.getProject(this.selectedProjectName).subscribe({
                                                                              next: (project: CodeProject | undefined) => {
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
