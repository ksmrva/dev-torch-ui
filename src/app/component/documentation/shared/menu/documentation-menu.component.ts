import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV } from "../../../../app.constants";
import { BaseComponent } from "../../../shared/base/base.component";
import { CanvasToolExplorerComponent } from "../../tool/canvas/explorer/canvas-tool-explorer.component";

export const OPTION_TOGGLE_BUTTON_SELECTED_CLASS: string = "menu-sidebar-button-selected";

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
    this.additionalCanvasExplorerButtonClasses = OPTION_TOGGLE_BUTTON_SELECTED_CLASS;
  }

  toggleCanvasExplorer(): void {
    if(this.canvasExplorerIsClosed) {
      this.canvasExplorerIsClosed = false;
      this.additionalCanvasExplorerButtonClasses = OPTION_TOGGLE_BUTTON_SELECTED_CLASS;

    } else {
      this.canvasExplorerIsClosed = true;
      this.additionalCanvasExplorerButtonClasses = "";

    }
  }

}
