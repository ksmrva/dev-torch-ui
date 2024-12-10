import { Component } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV } from '../../../app.constants';
import { CanvasViewerComponent } from '../../documentation/tool/canvas/viewer/canvas-viewer.component';
import { CodeModelSourceFileViewerComponent } from "../code/source/file/viewer/code-model-source-file-viewer.component";
import { CanvasViewerHeaderComponent } from "../../documentation/tool/canvas/viewer/header/canvas-viewer-header.component";
import { DbModelMenuComponent } from "../database/edit/menu/db-model-menu.component";

@Component({
  selector: 'model-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CodeModelSourceFileViewerComponent,
    DbModelMenuComponent
],
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.scss'
})
export class ModelViewerComponent extends BaseComponent {

  defaultSidebarOpen: boolean;

  codeViewerIsClosed: boolean;

  databaseViewerIsClosed: boolean;

  databaseMenuIsClosed: boolean;

  jsonViewerIsClosed: boolean;

  modelContentClass: string;

  menuTitle: string;

  additionalCodeViewerButtonClasses: string;

  additionalDatabaseViewerButtonClasses: string;

  additionalJsonViewerButtonClasses: string;

  constructor() {
    super();
    this.defaultSidebarOpen = true;
    this.modelContentClass = CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV;

    this.menuTitle = "documentation";
    this.codeViewerIsClosed = true;
    this.databaseViewerIsClosed = true;
    this.databaseMenuIsClosed = true;
    this.jsonViewerIsClosed = true;
    this.additionalCodeViewerButtonClasses = "";
    this.additionalDatabaseViewerButtonClasses = "";
    this.additionalJsonViewerButtonClasses = "";
  }

  toggleCodeViewer(): void {
    if(this.isCodeViewerClosed()) {
      this.openCodeViewer();

    } else {
      this.closeCodeViewer();

    }
  }

  toggleDatabaseViewer(): void {
    if(this.isDatabaseViewerClosed()) {
      this.openDatabaseViewer();

    } else {
      this.closeDatabaseViewer();

    }
  }

  toggleDatabaseMenu(): void {
    if(this.isDatabaseMenuClosed()) {
      this.openDatabaseMenu();

    } else {
      this.closeDatabaseMenu();

    }
  }

  toggleJsonViewer(): void {
    if(this.isJsonViewerClosed()) {
      this.openJsonViewer();

    } else {
      this.closeJsonViewer();

    }
  }

  isCodeViewerClosed(): boolean {
    return this.codeViewerIsClosed;
  }

  isDatabaseViewerClosed(): boolean {
    return this.databaseViewerIsClosed;
  }

  isDatabaseMenuClosed(): boolean {
    return this.databaseMenuIsClosed;
  }

  isJsonViewerClosed(): boolean {
    return this.jsonViewerIsClosed;
  }

  openCodeViewer(): void {
    this.codeViewerIsClosed = false;
    this.additionalCodeViewerButtonClasses = "model-viewer-sidebar-item-button-selected";

    this.closeDatabaseViewer();
    this.closeJsonViewer();
  }

  openDatabaseViewer(): void {
    this.databaseViewerIsClosed = false;
    this.additionalDatabaseViewerButtonClasses = "model-viewer-sidebar-item-button-selected";

    this.closeCodeViewer();
    this.closeJsonViewer();
  }

  openDatabaseMenu(): void {
    this.openDatabaseViewer();
    this.databaseMenuIsClosed = false;
  }

  openJsonViewer(): void {
    this.jsonViewerIsClosed = false;
    this.additionalJsonViewerButtonClasses = "model-viewer-sidebar-item-button-selected";

    this.closeCodeViewer();
    this.closeDatabaseViewer();
  }

  closeCodeViewer(): void {
    this.codeViewerIsClosed = true;
    this.additionalCodeViewerButtonClasses = "";
  }

  closeDatabaseViewer(): void {
    this.databaseViewerIsClosed = true;
    this.additionalDatabaseViewerButtonClasses = "";
  }

  closeDatabaseMenu(): void {
    this.databaseMenuIsClosed = true;
  }

  closeJsonViewer(): void {
    this.jsonViewerIsClosed = true;
    this.additionalJsonViewerButtonClasses = "";
  }

  addHighlightToTab(): void {

  }

}
