import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CollapsibleMenuComponent } from "../../../../../edit/menu/collapsible/collapsible-menu.component";
import { DbModelSourceEditorComponent } from "../editor/db-model-source-editor.component";
import { BaseComponent } from "../../../../../base.component";

@Component({
  selector: "db-model-source-menu",
  standalone: true,
  imports: [
    CollapsibleMenuComponent,
    DbModelSourceEditorComponent
  ],
  templateUrl: "./db-model-source-menu.component.html",
  styleUrl: "./db-model-source-menu.component.scss"
})
export class DbModelSourceMenuComponent extends BaseComponent {

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

    this.menuTitle = "source";
    this.baseHtmlId = "dbModelSourceMenu";
    this.collapsibleMenuBaseHtmlId = this.baseHtmlId + "_CollapsibleMenu";
    this.showBottomPadding = false;
  }

  menuClickedEventHandler(): void {
    this.menuToggleEvent.emit(true);
  }

}
