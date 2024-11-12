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

  @Input() dbMenuContentIsClosed: boolean;

  @Output() dbMenuToggleEvent: EventEmitter<boolean>;

  menuTitle: string;

  baseHtmlId: string;

  dbModelSourceMenuIsClosed: boolean;

  showBottomPadding: boolean;

  constructor() {
    super();
    this.dbMenuContentIsClosed = true;
    this.dbMenuToggleEvent = new EventEmitter<boolean>();

    this.menuTitle = "database";
    this.baseHtmlId = "dbModelMenu_CollapsibleMenu";
    this.dbModelSourceMenuIsClosed = true;
    this.showBottomPadding = false;
  }

  menuClickedEventHandler(): void {
    this.dbMenuToggleEvent.emit(true);
  }

  dbModelSourceMenuToggleClicked(): void {
    if (this.dbModelSourceMenuIsClosed) {
      this.dbModelSourceMenuIsClosed = false;

    } else {
      this.dbModelSourceMenuIsClosed = true;
    }
  }

}
