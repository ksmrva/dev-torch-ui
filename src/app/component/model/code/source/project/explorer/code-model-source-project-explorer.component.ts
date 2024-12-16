import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CodeModelSourceFileTreeNode } from '../../../../../../entity/model/code/source/file/tree/node/code-model-source-file-tree-node';
import { CodeModelSourceProject } from '../../../../../../entity/model/code/source/project/code-model-source-project';
import { ModalService } from '../../../../../../service/modal/modal.service';
import { CodeModelSourceProjectService } from '../../../../../../service/model/code/source/project/code-model-source-project.service';
import { CodeModelSourceFileListEntryComponent } from "../../file/list/entry/code-model-source-file-list-entry.component";
import { CodeModelSourceFileIconService } from '../../../../../../service/model/code/source/file/icon/code-model-source-file-icon.service';
import { CodeModelLanguage } from '../../../../../../entity/model/code/language/code-model-language';
import { CodeModelSourceFile } from '../../../../../../entity/model/code/source/file/code-model-source-file';
import { CodeModelSourceFileCodeExtension } from '../../../../../../entity/model/code/source/file/extension/code-model-source-file-code-extension';
import { CodeModelSourceFileService } from '../../../../../../service/model/code/source/file/code-model-source-file.service';
import { CodeModelSourceProjectEditModalComponent } from "../edit/modal/code-model-source-project-edit-modal.component";

@Component({
  selector: 'code-model-source-project-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,
    CodeModelSourceFileListEntryComponent,
    CodeModelSourceProjectEditModalComponent
],
  templateUrl: './code-model-source-project-explorer.component.html',
  styleUrl: './code-model-source-project-explorer.component.scss'
})
export class CodeModelSourceProjectExplorerComponent extends BaseComponent implements OnInit {

  projectNames: string[];

  selectedProject: CodeModelSourceProject | undefined;

  selectedFile: CodeModelSourceFile | undefined;

  selectedFileTextContents: string;

  codeEditorOptions: any;

  allCodeExtensions: CodeModelSourceFileCodeExtension[];

  projectEditModalBaseHtmlId: string;

  constructor(
    private codeModelSourceProjectService: CodeModelSourceProjectService,
    private codeModelSourceFileService: CodeModelSourceFileService,
    private codeModelSourceFileIconService: CodeModelSourceFileIconService,
    private modalService: ModalService
  ) {
    super();

    this.projectNames = [];
    this.selectedProject = undefined;
    this.selectedFile = undefined;
    this.selectedFileTextContents = "";

    this.codeEditorOptions = {
      theme: "vs-dark"
    };
    this.allCodeExtensions = [];
    this.projectEditModalBaseHtmlId = "codeModelSourceProject_Explorer_ProjectEditModal";
  }

  ngOnInit(): void {
    let codeProjectNamesSubscription = this.codeModelSourceProjectService.getProjectNames().subscribe({
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

    let allCodeExtensionsSubscription = this.codeModelSourceFileService.getCodeExtensions().subscribe({
                                                                                                next: (allCodeExtensionsResult: CodeModelSourceFileCodeExtension[] | undefined) => {
                                                                                                  if (!allCodeExtensionsResult) {
                                                                                                    throw new Error("Failed to initialize the Code Model Source File Code Extensions");
                                                                                                  }
                                                                                                  this.allCodeExtensions = allCodeExtensionsResult;
                                                                                                },
                                                                                                error: (err: any) => {
                                                                                                  throw new Error( "Failed to initialize the Code Model Source File Code Extensions due to [" + err + "]" );
                                                                                                },
                                                                                                complete: () => {
                                                                                                  console.log("Finished initializing Code Model Source File Code Extensions");
                                                                                                }
                                                                                              });
    this.addLongLivingSubscription(allCodeExtensionsSubscription);
  }

  getIconPathForFile(fileName: string): string {
    return this.codeModelSourceFileIconService.getIconPathFromFileName(fileName, false);
  }

  handleClickedEntry(clickedEntry: CodeModelSourceFileTreeNode): void {
    this.codeModelSourceFileService.getFile(clickedEntry.fileId).subscribe({
                                                                next: (codeModelFileResult: CodeModelSourceFile | undefined) => {
                                                                  if(codeModelFileResult) {
                                                                    this.selectedFile = codeModelFileResult

                                                                    let selectedFileData = this.selectedFile.data;
                                                                    if(selectedFileData && !selectedFileData.isBinary) {
                                                                      this.selectedFileTextContents = selectedFileData.textContent;
                                                                    }
                                                                    let codeExtension = this.matchCodeExtensionForFile(this.selectedFile);
                                                                    if(codeExtension) {
                                                                      this.updateCodeLanguage(codeExtension.language);
                                                                    }
                                                                  }
                                                                },
                                                                error: (err: any) => {
                                                                  throw new Error( "Failed to load the Code Model Source File with ID [" + clickedEntry.fileId + "] due to [" + err + "]" );
                                                                },
                                                                complete: () => {
                                                                  console.log("Finished loading the Code Model Source File with ID [" + clickedEntry.fileId + "]");
                                                                }
                                                              });
  }

  openCreateProjectModal(): void {
    this.modalService.open(this.projectEditModalBaseHtmlId);
  }

  selectProject(selectedProjectName: string): void {
    if(selectedProjectName !== undefined) {
      this.codeModelSourceProjectService.getProject(selectedProjectName).subscribe({
                                                                        next: (project: CodeModelSourceProject | undefined) => {
                                                                          if (!project) {
                                                                            throw new Error("Failed to get the Code Project using Name [" + selectedProjectName + "]");
                                                                          }
                                                                          this.selectedProject = project;
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error("Failed to get the Code Project using Name [" + selectedProjectName + "] due to [" + err + "]");
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished getting the Code Project");
                                                                        }
                                                                      });
    }
  }

  private matchCodeExtensionForFile(file: CodeModelSourceFile): CodeModelSourceFileCodeExtension | undefined {
    let codeExtensionResult = undefined;
    this.allCodeExtensions.find((codeExtension: CodeModelSourceFileCodeExtension) => {
      let fileExtension = this.codeModelSourceFileService.extractFileExtension(file);
      if(
        fileExtension
        && fileExtension === codeExtension.extension
      ) {
        codeExtensionResult = codeExtension;
      }
    });
    return codeExtensionResult;
  }

  private updateCodeLanguage(langauge: CodeModelLanguage | null): void {
    if(langauge) {
      console.log("Updating language to [" + langauge.name + "]");
      this.codeEditorOptions.language = langauge.name;
    }
  }

}
