import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../base.component";
import { CollapsibleMenuComponent } from "../../../edit/menu/collapsible/collapsible-menu.component";
import { CanvasEditorComponent } from "../editor/canvas-editor.component";

@Component({
  selector: "canvas-menu",
  standalone: true,
  imports: [
    CollapsibleMenuComponent,
    CanvasEditorComponent
  ],
  templateUrl: "./canvas-menu.component.html",
  styleUrl: "./canvas-menu.component.scss"
})
export class CanvasMenuComponent extends BaseComponent {

  @Input() menuContentIsClosed: boolean;

  @Output() menuToggleEvent: EventEmitter<boolean>;

  menuTitle: string;

  baseHtmlId: string;

  collapsibleMenuBaseHtmlId: string;

  showBottomPadding: boolean;

  constructor() {
    super();
    this.menuContentIsClosed = true;
    this.menuToggleEvent = new EventEmitter<boolean>();

    this.menuTitle = "canvas";
    this.baseHtmlId = "canvasMenu";
    this.collapsibleMenuBaseHtmlId = this.baseHtmlId + "_CollapsibleMenu";
    this.showBottomPadding = true;
  }

  menuClickedEventHandler(): void {
    this.menuToggleEvent.emit(true);
  }

}
