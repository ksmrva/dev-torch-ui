import { Component } from "@angular/core";
import { BaseComponent } from "../../../base.component";
import { CommonModule } from "@angular/common";
import { CodeModelFileIconService } from "../../../../service/model/code/file/icon/code-model-file-icon-factory.service";
import { FormsModule } from "@angular/forms";
import { CodeFile } from "../../../../entity/model/code/file/code-file";
import { CodeFileExplorerComponent } from "../file/explorer/code-file-explorer.component";
import { CodeFileNode } from "../../../../entity/model/code/file/node/code-file-node";
import { CodeModelFileService } from "../../../../service/model/code/file/code-model-file.service";
import { CodeTextFile } from "../../../../entity/model/code/file/type/text/code-text-file";

@Component({
  selector: "code-viewer",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CodeFileExplorerComponent
],
  templateUrl: "./code-viewer.component.html",
  styleUrl: "./code-viewer.component.scss"
})
export class CodeViewerComponent extends BaseComponent {

  selectedCodeFile: CodeFile | undefined;

  constructor(
    private codeModelFileService: CodeModelFileService,
    private codeModelFileIconService: CodeModelFileIconService
  ) {
    super();

    this.selectedCodeFile = undefined;
  }

  getNameFromPath(path: string): string {
    let nameFromPath = "";
    let lastIndexOfSlash = path.lastIndexOf("/");
    if(lastIndexOfSlash > 0 && lastIndexOfSlash < path.length) {
      nameFromPath = path.substring(lastIndexOfSlash + 1);
    }
    return nameFromPath;
  }

  getIconPathForFile(fileName: string): string {
    return this.codeModelFileIconService.getIconPathFromFileName(fileName, false, false);
  }

  handleClickedEntry(clickedEntry: CodeFileNode): void {
    this.codeModelFileService.getFile(clickedEntry.fileId).subscribe({
                                                              next: (codeFileResult: CodeFile | undefined) => {
                                                                if(codeFileResult) {
                                                                  this.selectedCodeFile = codeFileResult
                                                                }
                                                              },
                                                              error: (err: any) => {
                                                                throw new Error( "Failed to load the Code File with ID [" + clickedEntry.fileId + "] due to [" + err + "]" );
                                                              },
                                                              complete: () => {
                                                                console.log("Finished loading the Code File with ID [" + clickedEntry.fileId + "]");
                                                              }
    });
  }

  getContentsFromFileIfText(fileToUse: CodeFile): string {
    let codeFileTextContents = "";
    if(fileToUse) {
      if((fileToUse instanceof CodeTextFile)) {
        let textFileToUse: CodeTextFile = fileToUse as CodeTextFile;
        codeFileTextContents = textFileToUse.contents;
      }
    }
    return codeFileTextContents;
  }

}
