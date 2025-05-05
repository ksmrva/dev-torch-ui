import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { Observable, of } from "rxjs";
import { CodeModelLanguage } from "../../../../../../entity/model/code/source/language/code-model-language";
import { CodeModelSourceFile } from "../../../../../../entity/model/code/source/file/code-model-source-file";
import { CodeModelSourceFileCodeExtension } from "../../../../../../entity/model/code/source/file/extension/code-model-source-file-code-extension";
import { CodeModelSourceProject } from "../../../../../../entity/model/code/source/project/code-model-source-project";
import { ModalService } from "../../../../../../service/shared/modal/modal.service";
import { CodeModelSourceFileService } from "../../../../../../service/model/code/source/file/code-model-source-file.service";
import { CodeModelSourceFileIconService } from "../../../../../../service/model/code/source/file/icon/code-model-source-file-icon.service";
import { BaseComponent } from "../../../../../shared/base/base.component";
import { ExplorerPanelListEntry } from "../../../../../../entity/shared/explorer/panel/list/entry/explorer-panel-list-entry";
import { ExplorerPanelListComponent } from "../../../../../shared/explorer/panel/list/explorer-panel-list.component";
import Split from 'split-grid';

@Component({
  selector: 'code-model-source-project-preview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,
    ExplorerPanelListComponent,
],
  templateUrl: './code-model-source-project-preview.component.html',
  styleUrl: './code-model-source-project-preview.component.scss'
})
export class CodeModelSourceProjectPreviewComponent extends BaseComponent implements OnInit {

  @Input() projectForPreviewObservable: Observable< CodeModelSourceProject | undefined >;

  projectForPreview: CodeModelSourceProject | undefined;

  selectedFile: CodeModelSourceFile | undefined;

  selectedFileTextContents: string;

  codeEditorOptions: any;

  allCodeExtensions: CodeModelSourceFileCodeExtension[];

  projectEditModalBaseHtmlId: string;

  projectFileListBaseHtmlId: string;

  constructor(
    private codeModelSourceFileService: CodeModelSourceFileService,
    private codeModelSourceFileIconService: CodeModelSourceFileIconService,
    private modalService: ModalService
  ) {
    super();
    this.projectForPreviewObservable = of(undefined);
    this.projectForPreview = undefined;
    this.selectedFile = undefined;
    this.selectedFileTextContents = "";

    this.codeEditorOptions = {
      theme: "vs-dark",
      automaticLayout: true
    };
    this.allCodeExtensions = [];
    this.projectEditModalBaseHtmlId = "codeModelSourceProject_Explorer_ProjectEditModal";
    this.projectFileListBaseHtmlId = "codeModelSourceProjectPreview_FileListPanel_FileList";
  }

  ngOnInit(): void {
    Split({
      columnGutters: [{
          track: 1,
          element: document.querySelector('.code-project-preview-gutter-col-1')!,
      }],
    })

    let projectForPreviewSubscription = this.projectForPreviewObservable.subscribe({
                                                                              next: (nextProjectForPreview: CodeModelSourceProject | undefined) => {
                                                                                this.projectForPreview = nextProjectForPreview;
                                                                              },
                                                                              error: (err: any) => {
                                                                                throw new Error( "Failed to load the Code Model Source Project for preview due to [" + err + "]" );
                                                                              },
                                                                              complete: () => {
                                                                                console.log( "Finished loading the Code Model Source Project for preview" );
                                                                              }
                                                                            });
    this.addLongLivingSubscription(projectForPreviewSubscription);
  }

  getIconPathForFile(fileName: string): string {
    return this.codeModelSourceFileIconService.getIconPathFromFileName(fileName, false);
  }

  handleClickedEntry(clickedEntry: ExplorerPanelListEntry): void {
    this.codeModelSourceFileService.getFile(clickedEntry.id).subscribe({
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
                                                                  throw new Error( "Failed to load the Code Model Source File with ID [" + clickedEntry.id + "] due to [" + err + "]" );
                                                                },
                                                                complete: () => {
                                                                  console.log("Finished loading the Code Model Source File with ID [" + clickedEntry.id + "]");
                                                                }
                                                              });
  }

  openCreateProjectModal(): void {
    this.modalService.open(this.projectEditModalBaseHtmlId);
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
