import { ExplorerPanelListService } from '../../../../../service/shared/explorer/panel/list/explorer-panel-list.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { CommonModule } from '@angular/common';
import { ExplorerPanelListEntry } from '../../../../../entity/shared/explorer/panel/list/entry/explorer-panel-list-entry';
import { ExplorerPanelListIconService } from '../../../../../service/shared/explorer/panel/list/icon/explorer-panel-list-icon.service';

export const ENTRY_LIST_SPACING_PER_LEVEL = " ";
export const NON_DIRECTORY_EXTRA_SPACING = "     ";

@Component({
  selector: 'explorer-panel-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './explorer-panel-list.component.html',
  styleUrl: './explorer-panel-list.component.scss'
})
export class ExplorerPanelListComponent extends BaseComponent implements OnInit {

  @Input() entry: ExplorerPanelListEntry;

  @Input() listLevel: number;

  @Input() baseHtmlId: string;

  @Output() entryClicked: EventEmitter<ExplorerPanelListEntry>;

  subEntries: ExplorerPanelListEntry[] | undefined;

  showSubEntries: boolean;

  additionalIconClasses: string;

  entryListSpacing: string;

  subEntryExtraSpacing: string;

  constructor(
    private explorerPanelListService: ExplorerPanelListService,
    private explorerPanelListIconService: ExplorerPanelListIconService
  ) {
    super();
    this.entry = new ExplorerPanelListEntry();
    this.listLevel = 0;
    this.baseHtmlId = "";
    this.entryClicked = new EventEmitter<ExplorerPanelListEntry>();

    this.subEntries = undefined;
    this.showSubEntries = false;
    this.additionalIconClasses = "";
    this.entryListSpacing = "";
    this.subEntryExtraSpacing = NON_DIRECTORY_EXTRA_SPACING;

    this.initAdditionalIconClasses();
  }

  ngOnInit(): void {
    for(let i = 0; i < this.listLevel; i++) {
      this.entryListSpacing += ENTRY_LIST_SPACING_PER_LEVEL;
    }
  }

  handleClick(): void {
    if(this.doesEntryHaveSubEntries()) {
      if(this.entry && this.subEntries === undefined) {
        this.explorerPanelListService.getSubEntries(this.entry.id, this.entry.type).subscribe({
                                                                      next: (subEntriesResult: ExplorerPanelListEntry[] | undefined) => {
                                                                        if (!subEntriesResult) {
                                                                          throw new Error("Failed to get the Sub-Entries for Entry ID [" + this.entry.id + "]");
                                                                        }
                                                                        this.subEntries = subEntriesResult;
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error("Failed to get the Sub-Entries for Entry ID [" + this.entry.id + "] due to [" + err + "]");
                                                                      },
                                                                      complete: () => {
                                                                        console.log("Finished getting the Sub-Entries for Entry ID [" + this.entry.id + "]");
                                                                      }
        });
      }

      this.toggleSubEntriesDisplay();
    }

    this.entryClicked.emit(this.entry);
  }

  getIconPath(): string {
    return this.explorerPanelListIconService.getIconPathForEntry(this.entry);
  }

  isNotRootEntry(): boolean {
    return this.listLevel !== 0;
  }

  subEntryClicked(clickedEntry: ExplorerPanelListEntry): void {
    this.entryClicked.emit(clickedEntry);
  }

  toggleSubEntriesDisplay(): void {
    this.showSubEntries = !this.showSubEntries;

    this.initAdditionalIconClasses();
  }

  doesEntryHaveSubEntries(): boolean {
    return this.entry.hasSubEntries;
  }

  private initAdditionalIconClasses(): void {
    if (!this.showSubEntries) {
      this.additionalIconClasses = "bi-chevron-down";
    } else {
      this.additionalIconClasses = "bi-chevron-right";
    }
  }

}
