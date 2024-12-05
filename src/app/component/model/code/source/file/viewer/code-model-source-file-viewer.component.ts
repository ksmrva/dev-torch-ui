import { CommonModule } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { CodeModelSourceFile } from "../../../../../../entity/model/code/source/file/code-model-source-file";
import { CodeModelSourceFileService } from "../../../../../../service/model/code/source/file/code-model-source-file.service";
import { CodeModelSourceFileIconService } from "../../../../../../service/model/code/source/file/icon/code-model-source-file-icon.service";
import { BaseComponent } from "../../../../../base.component";
import { CodeModelSourceFileExplorerComponent } from "../explorer/code-model-source-file-explorer.component";
import { CodeModelSourceFileTreeNode } from "../../../../../../entity/model/code/source/file/tree/node/code-model-source-file-tree-node";
import { CodeModelLanguage } from "../../../../../../entity/model/code/language/code-model-language";
import { CodeModelSourceFileCodeExtension } from "../../../../../../entity/model/code/source/file/extension/code-model-source-file-code-extension";

@Component({
  selector: "code-model-source-file-viewer",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CodeModelSourceFileExplorerComponent,
    MonacoEditorModule
  ],
  templateUrl: "./code-model-source-file-viewer.component.html",
  styleUrl: "./code-model-source-file-viewer.component.scss"
})
export class CodeModelSourceFileViewerComponent extends BaseComponent implements OnInit {

  selectedFile: CodeModelSourceFile | undefined;

  selectedFileTextContents: string;

  codeEditorOptions: any;

  allCodeExtensions: CodeModelSourceFileCodeExtension[];

  constructor(
    private codeModelFileService: CodeModelSourceFileService,
    private codeModelFileIconService: CodeModelSourceFileIconService
  ) {
    super();

    this.selectedFile = undefined;
    this.selectedFileTextContents = "";
    this.codeEditorOptions = {
      theme: "vs-dark"
    };
    this.allCodeExtensions = [];
  }

  ngOnInit(): void {
    let allCodeExtensionsSubscription = this.codeModelFileService.getCodeExtensions().subscribe({
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
    return this.codeModelFileIconService.getIconPathFromFileName(fileName, false);
  }

  handleClickedEntry(clickedEntry: CodeModelSourceFileTreeNode): void {
    this.codeModelFileService.getFile(clickedEntry.fileId).subscribe({
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

  private matchCodeExtensionForFile(file: CodeModelSourceFile): CodeModelSourceFileCodeExtension | undefined {
    let codeExtensionResult = undefined;
    this.allCodeExtensions.find((codeExtension: CodeModelSourceFileCodeExtension) => {
      let fileExtension = this.codeModelFileService.extractFileExtension(file);
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
