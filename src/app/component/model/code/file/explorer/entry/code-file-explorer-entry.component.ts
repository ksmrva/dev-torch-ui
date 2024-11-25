import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeFileNode } from '../../../../../../entity/model/code/file/node/code-file-node';
import { CodeModelFileService } from '../../../../../../service/model/code/file/code-model-file.service';
import { CodeModelFileIconService } from '../../../../../../service/model/code/file/icon/code-model-file-icon-factory.service';
import { BaseComponent } from '../../../../../base.component';

export const ENTRY_LIST_SPACING_PER_LEVEL = " ";
export const NON_DIRECTORY_EXTRA_SPACING_PER_LEVEL = "     ";

@Component({
  selector: 'code-file-explorer-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './code-file-explorer-entry.component.html',
  styleUrl: './code-file-explorer-entry.component.scss'
})
export class CodeFileExplorerEntryComponent extends BaseComponent implements OnInit {

  @Input() entryListLevel: number;

  @Input() fileEntry: CodeFileNode;

  @Output() entryClicked: EventEmitter<CodeFileNode>;

  childEntries: CodeFileNode[] | undefined;

  showChildEntries: boolean;

  additionalIconClasses: string;

  entryListSpacing: string;

  nonDirectoryExtraListSpacing: string;

  baseHtmlId: string;

  constructor(
    private codeModelFileService: CodeModelFileService,
    private codeModelFileIconService: CodeModelFileIconService
  ) {
    super();
    this.entryListLevel = 0;
    this.fileEntry = new CodeFileNode();
    this.entryClicked = new EventEmitter<CodeFileNode>();

    this.childEntries = undefined;
    this.showChildEntries = false;
    this.additionalIconClasses = "";
    this.entryListSpacing = "";
    this.nonDirectoryExtraListSpacing = "";
    this.baseHtmlId = "codeFileExplorerEntry";

    this.initAdditionalIconClasses();
  }

  ngOnInit(): void {
    for(let i = 0; i < this.entryListLevel; i++) {
      this.entryListSpacing += ENTRY_LIST_SPACING_PER_LEVEL;
      this.nonDirectoryExtraListSpacing += NON_DIRECTORY_EXTRA_SPACING_PER_LEVEL;
    }

    this.baseHtmlId += "_" + this.fileEntry.id;
  }

  handleClick(): void {
    if(this.doesEntryHaveChildren()) {
      if(this.childEntries === undefined) {
        this.codeModelFileService.getChildNodes(this.fileEntry.id).subscribe({
                                                                      next: (childEntriesResult: CodeFileNode[] | undefined) => {
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
    return this.codeModelFileIconService.getIconPathFromFileName(this.fileEntry.name, this.isTopLevelNode(), this.doesEntryHaveChildren());
  }

  isTopLevelNode(): boolean {
    return this.entryListLevel === 0;
  }

  isNotTopLevelNode(): boolean {
    return !this.isTopLevelNode();
  }

  childEntryClicked(clickedEntry: CodeFileNode): void {
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
