import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../../base.component";
import { CollapsibleMenuComponent } from "../../../../edit/menu/collapsible/collapsible-menu.component";
import { DbModelEditorComponent } from "../editor/db-model-editor.component";
import { DbModelSourceEditorComponent } from "../../source/edit/editor/db-model-source-editor.component";

@Component({
  selector: "db-model-menu",
  standalone: true,
  imports: [
    CollapsibleMenuComponent,
    DbModelEditorComponent,
    DbModelSourceEditorComponent
],
  templateUrl: "./db-model-menu.component.html",
  styleUrl: "./db-model-menu.component.scss"
})
export class DbModelMenuComponent extends BaseComponent {

  @Input() menuContentIsClosed: boolean;

  @Output() menuContentToggleEvent: EventEmitter<boolean>;

  menuTitle: string;

  baseHtmlId: string;

  sourceMenuIsClosed: boolean;

  showBottomPadding: boolean;

  constructor() {
    super();
    this.menuContentIsClosed = true;
    this.menuContentToggleEvent = new EventEmitter<boolean>();

    this.menuTitle = "database";
    this.baseHtmlId = "dbModelMenu_CollapsibleMenu";
    this.sourceMenuIsClosed = true;
    this.showBottomPadding = false;
  }

  menuClickedEventHandler(): void {
    this.menuContentToggleEvent.emit(true);
  }

  sourceMenuToggleClicked(): void {
    if (this.sourceMenuIsClosed) {
      this.sourceMenuIsClosed = false;

    } else {
      this.sourceMenuIsClosed = true;
    }
  }

}
