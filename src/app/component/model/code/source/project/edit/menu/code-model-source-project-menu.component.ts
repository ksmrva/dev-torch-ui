import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../../../../base.component";
import { CollapsibleMenuComponent } from "../../../../../../edit/menu/collapsible/collapsible-menu.component";
import { CodeModelSourceProjectEditorComponent } from "../editor/code-model-source-project-editor.component";

@Component({
  selector: 'code-model-source-project-menu',
  standalone: true,
  imports: [
    CodeModelSourceProjectEditorComponent,
    CollapsibleMenuComponent
  ],
  templateUrl: './code-model-source-project-menu.component.html',
  styleUrl: './code-model-source-project-menu.component.scss'
})
export class CodeModelSourceProjectMenuComponent extends BaseComponent {

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

    this.menuTitle = "code";
    this.baseHtmlId = "codeModelSourceProject_Menu";
    this.collapsibleMenuBaseHtmlId = this.baseHtmlId + "_CollapsibleMenu";
    this.showBottomPadding = true;
  }

  menuClickedEventHandler(): void {
    this.menuToggleEvent.emit(true);
  }

}
