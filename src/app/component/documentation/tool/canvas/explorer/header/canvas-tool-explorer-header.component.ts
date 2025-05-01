import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SqlDatabaseDetailPath } from "../../../../../../entity/model/database/detail/sql/path/sql-database-path";
import { ModalService } from "../../../../../../service/shared/modal/modal.service";
import { BaseComponent } from "../../../../../shared/base/base.component";
import { CanvasEditModalComponent } from "../../edit/modal/canvas-edit-modal.component";

@Component({
  selector: "canvas-tool-explorer-header",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CanvasEditModalComponent
],
  templateUrl: "./canvas-tool-explorer-header.component.html",
  styleUrl: "./canvas-tool-explorer-header.component.scss"
})
export class CanvasToolExplorerHeaderComponent extends BaseComponent {

  @Input() canvasTitle: string;

  @Input() sidebarOpenInitialValue: boolean;

  @Input() zoomSettingInitialValue: number;

  @Input() zoomSettingMaxValue: number;

  @Input() availableCanvasNames: string[];

  @Input() availableDatabasePaths: SqlDatabaseDetailPath[];

  @Output() zoomSettingEvent: EventEmitter<number>;

  @Output() sidebarToggleEvent: EventEmitter<boolean>;

  @Output() loadSelectedCanvasEvent: EventEmitter<string>;

  @Output() addCellsFromDatabaseEvent: EventEmitter<SqlDatabaseDetailPath>;

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
    this.availableDatabasePaths = [];
    this.zoomSettingEvent = new EventEmitter<number>();
    this.sidebarToggleEvent = new EventEmitter<boolean>();
    this.loadSelectedCanvasEvent = new EventEmitter<string>();
    this.addCellsFromDatabaseEvent = new EventEmitter<SqlDatabaseDetailPath>();
    this.saveAllChangesButtonClickEvent = new EventEmitter<boolean>();
    this.undoAllChangesButtonClickEvent = new EventEmitter<boolean>();

    this.zoomSetting = this.zoomSettingInitialValue;
    this.createCanvasModalBaseHtmlId = "canvasToolExplorerHeader_CreateCanvasModal";
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

  addCellsFromDatabase(databasePath: SqlDatabaseDetailPath): void {
    this.addCellsFromDatabaseEvent.emit(databasePath);
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
