import { Component } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV } from '../../../app.constants';
import { CanvasViewerComponent } from '../tool/canvas/viewer/canvas-viewer.component';
import { CodeModelSourceFileViewerComponent } from "../../model/code/source/file/viewer/code-model-source-file-viewer.component";

@Component({
  selector: 'documentation-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CanvasViewerComponent
],
  templateUrl: './documentation-viewer.component.html',
  styleUrl: './documentation-viewer.component.scss'
})
export class DocumentationViewerComponent extends BaseComponent {

  defaultSidebarOpen: boolean;

  canvasViewerIsClosed: boolean;

  documentationContentClass: string;

  menuTitle: string;

  additionalCanvasViewerButtonClasses: string;

  constructor() {
    super();
    this.defaultSidebarOpen = true;
    this.documentationContentClass = CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV;

    this.menuTitle = "documentation";
    this.canvasViewerIsClosed = false;
    this.additionalCanvasViewerButtonClasses = "documentation-viewer-sidebar-item-button-selected";
  }

  toggleCanvasViewer(): void {
    if(this.canvasViewerIsClosed) {
      this.canvasViewerIsClosed = false;
      this.additionalCanvasViewerButtonClasses = "documentation-viewer-sidebar-item-button-selected";

    } else {
      this.canvasViewerIsClosed = true;
      this.additionalCanvasViewerButtonClasses = "";

    }
  }

}
