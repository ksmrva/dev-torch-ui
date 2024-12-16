import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CodeModelSourceFileTreeNode } from "../../../../../../../entity/model/code/source/file/tree/node/code-model-source-file-tree-node";
import { CodeModelSourceFileService } from "../../../../../../../service/model/code/source/file/code-model-source-file.service";
import { CodeModelSourceFileIconService } from "../../../../../../../service/model/code/source/file/icon/code-model-source-file-icon.service";
import { BaseComponent } from "../../../../../../base.component";

export const ENTRY_LIST_SPACING_PER_LEVEL = " ";
export const NON_DIRECTORY_EXTRA_SPACING = "     ";

@Component({
  selector: 'code-model-source-file-list-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './code-model-source-file-list-entry.component.html',
  styleUrl: './code-model-source-file-list-entry.component.scss'
})
export class CodeModelSourceFileListEntryComponent extends BaseComponent implements OnInit {

  @Input() entryListLevel: number;

  @Input() fileEntry: CodeModelSourceFileTreeNode;

  @Output() entryClicked: EventEmitter<CodeModelSourceFileTreeNode>;

  childEntries: CodeModelSourceFileTreeNode[] | undefined;

  showChildEntries: boolean;

  additionalIconClasses: string;

  entryListSpacing: string;

  nonDirectoryExtraListSpacing: string;

  baseHtmlId: string;

  constructor(
    private codeModelFileService: CodeModelSourceFileService,
    private codeModelFileIconService: CodeModelSourceFileIconService
  ) {
    super();
    this.entryListLevel = 0;
    this.fileEntry = new CodeModelSourceFileTreeNode();
    this.entryClicked = new EventEmitter<CodeModelSourceFileTreeNode>();

    this.childEntries = undefined;
    this.showChildEntries = false;
    this.additionalIconClasses = "";
    this.entryListSpacing = "";
    this.nonDirectoryExtraListSpacing = NON_DIRECTORY_EXTRA_SPACING;
    this.baseHtmlId = "codeModelSourceFileEntry";

    this.initAdditionalIconClasses();
  }

  ngOnInit(): void {
    for(let i = 0; i < this.entryListLevel; i++) {
      this.entryListSpacing += ENTRY_LIST_SPACING_PER_LEVEL;
    }

    this.baseHtmlId += "_" + this.fileEntry.id;
  }

  handleClick(): void {
    if(this.doesEntryHaveChildren()) {
      if(this.childEntries === undefined) {
        this.codeModelFileService.getChildNodes(this.fileEntry.id).subscribe({
                                                                      next: (childEntriesResult: CodeModelSourceFileTreeNode[] | undefined) => {
                                                                        if (!childEntriesResult) {
                                                                          throw new Error("Failed to get the Child Entries for Parent ID [" + this.fileEntry.id + "]");
                                                                        }
                                                                        this.childEntries = childEntriesResult;
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error("Failed to get the Child Entries for Parent ID [" + this.fileEntry.id + "] due to [" + err + "]");
                                                                      },
                                                                      complete: () => {
                                                                        console.log("Finished getting the Child Entries for Parent ID [" + this.fileEntry.id + "]");
                                                                      }
        });
      }

      this.toggleChildEntriesDisplay();
    }

    this.entryClicked.emit(this.fileEntry);
  }

  getIconPathForFile(): string {
    return this.codeModelFileIconService.getIconPathFromFileName(this.fileEntry.name, this.doesEntryHaveChildren());
  }

  isTopLevelNode(): boolean {
    return this.entryListLevel === 0;
  }

  isNotTopLevelNode(): boolean {
    return !this.isTopLevelNode();
  }

  childEntryClicked(clickedEntry: CodeModelSourceFileTreeNode): void {
    this.entryClicked.emit(clickedEntry);
  }

  toggleChildEntriesDisplay(): void {
    this.showChildEntries = !this.showChildEntries;

    this.initAdditionalIconClasses();
  }

  doesEntryHaveChildren(): boolean {
    return this.fileEntry.hasChildren;
  }

  private initAdditionalIconClasses(): void {
    if (!this.showChildEntries) {
      this.additionalIconClasses = "bi-chevron-down";
    } else {
      this.additionalIconClasses = "bi-chevron-right";
    }
  }

}
