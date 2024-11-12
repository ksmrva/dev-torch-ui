import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DbModelName } from "../../../../entity/model/database/name/db-model-name";
import { BaseComponent } from "../../../base.component";

@Component({
  selector: "canvas-viewer-header",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule
  ],
  templateUrl: "./canvas-viewer-header.component.html",
  styleUrl: "./canvas-viewer-header.component.scss"
})
export class CanvasViewerHeaderComponent extends BaseComponent {

  @Input() canvasTitle: string;

  @Input() sidebarOpenInitialValue: boolean;

  @Input() zoomSettingInitialValue: number;

  @Input() zoomSettingMaxValue: number;

  @Input() availableCanvasNames: string[];

  @Input() availableDbModelNames: DbModelName[];

  @Output() zoomSettingEvent: EventEmitter<number>;

  @Output() sidebarToggleEvent: EventEmitter<boolean>;

  @Output() loadSelectedCanvasEvent: EventEmitter<string>;

  @Output() addCellsFromDbModelEvent: EventEmitter<DbModelName>;

  @Output() saveAllChangesButtonClickEvent: EventEmitter<boolean>;

  @Output() undoAllChangesButtonClickEvent: EventEmitter<boolean>;

  zoomSetting: number;

  constructor() {
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
    this.addCellsFromDbModelEvent = new EventEmitter<DbModelName>();
    this.saveAllChangesButtonClickEvent = new EventEmitter<boolean>();
    this.undoAllChangesButtonClickEvent = new EventEmitter<boolean>();

    this.zoomSetting = this.zoomSettingInitialValue;
  }

  sidebarToggleClicked(): void {
    this.sidebarToggleEvent.emit(true);
  }

  loadSelectedCanvas(selectedCanvasName: string): void {
    this.loadSelectedCanvasEvent.emit(selectedCanvasName);
  }

  addCellsFromDbModel(dbModelName: DbModelName): void {
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
