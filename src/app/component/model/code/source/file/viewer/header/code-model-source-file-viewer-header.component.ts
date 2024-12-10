import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabasePath } from '../../../../../../../entity/model/database/component/path/database-path';
import { ModalService } from '../../../../../../../service/modal/modal.service';
import { CanvasEditModalComponent } from '../../../../../../documentation/tool/canvas/edit/modal/canvas-edit-modal.component';

@Component({
  selector: 'code-model-source-file-viewer-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CanvasEditModalComponent
  ],
  templateUrl: './code-model-source-file-viewer-header.component.html',
  styleUrl: './code-model-source-file-viewer-header.component.scss'
})
export class CodeModelSourceFileViewerHeaderComponent extends BaseComponent {

  @Input() canvasTitle: string;

  @Input() sidebarOpenInitialValue: boolean;

  @Input() zoomSettingInitialValue: number;

  @Input() zoomSettingMaxValue: number;

  @Input() availableCanvasNames: string[];

  @Input() availableDbModelNames: DatabasePath[];

  @Output() zoomSettingEvent: EventEmitter<number>;

  @Output() sidebarToggleEvent: EventEmitter<boolean>;

  @Output() loadSelectedCanvasEvent: EventEmitter<string>;

  @Output() addCellsFromDbModelEvent: EventEmitter<DatabasePath>;

  @Output() saveAllChangesButtonClickEvent: EventEmitter<boolean>;

  @Output() undoAllChangesButtonClickEvent: EventEmitter<boolean>;

  zoomSetting: number;

  createCanvasModalBaseHtmlId: string;

  constructor(
    private modalService: ModalService
  ) {
    super();
    this.canvasTitle = "";
    this.sidebarOpenInitialValue = true;
    this.zoomSettingInitialValue = 10;
    this.zoomSettingMaxValue = 20;
    this.availableCanvasNames = [];
    this.availableDbModelNames = [];
    this.zoomSettingEvent = new EventEmitter<number>();
    this.sidebarToggleEvent = new EventEmitter<boolean>();
    this.loadSelectedCanvasEvent = new EventEmitter<string>();
    this.addCellsFromDbModelEvent = new EventEmitter<DatabasePath>();
    this.saveAllChangesButtonClickEvent = new EventEmitter<boolean>();
    this.undoAllChangesButtonClickEvent = new EventEmitter<boolean>();

    this.zoomSetting = this.zoomSettingInitialValue;
    this.createCanvasModalBaseHtmlId = "canvasViewer_CreateCanvasModal";
  }

  sidebarToggleClicked(): void {
    this.sidebarToggleEvent.emit(true);
  }

  loadSelectedCanvas(selectedCanvasName: string): void {
    this.loadSelectedCanvasEvent.emit(selectedCanvasName);
  }

  openEditModal(): void {
    this.modalService.open(this.createCanvasModalBaseHtmlId);
  }

  addCellsFromDbModel(dbModelName: DatabasePath): void {
    this.addCellsFromDbModelEvent.emit(dbModelName);
  }

  updateCanvasZoom(): void {
    this.zoomSettingEvent.emit(this.zoomSetting);
  }

  saveAllChanges(): void {
    this.saveAllChangesButtonClickEvent.emit(true);
  }

  undoAllChanges(): void {
    this.undoAllChangesButtonClickEvent.emit(true);
  }

}
