import { Component } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV } from '../../../app.constants';
import { CanvasToolExplorerComponent } from '../tool/canvas/explorer/canvas-tool-explorer.component';

@Component({
  selector: 'documentation-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CanvasToolExplorerComponent
],
  templateUrl: './documentation-menu.component.html',
  styleUrl: './documentation-menu.component.scss'
})
export class DocumentationMenuComponent extends BaseComponent {

  canvasExplorerIsClosed: boolean;

  documentationContentClass: string;

  additionalCanvasExplorerButtonClasses: string;

  constructor() {
    super();
    this.documentationContentClass = CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV;

    this.canvasExplorerIsClosed = false;
    this.additionalCanvasExplorerButtonClasses = "documentation-menu-sidebar-option-toggle-button-selected";
  }

  toggleCanvasExplorer(): void {
    if(this.canvasExplorerIsClosed) {
      this.canvasExplorerIsClosed = false;
      this.additionalCanvasExplorerButtonClasses = "documentation-menu-sidebar-option-toggle-button-selected";

    } else {
      this.canvasExplorerIsClosed = true;
      this.additionalCanvasExplorerButtonClasses = "";

    }
  }

}
