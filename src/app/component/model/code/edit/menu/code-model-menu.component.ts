import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { CollapsibleMenuComponent } from "../../../../edit/menu/collapsible/collapsible-menu.component";
import { CodeModelSourceEditorComponent } from "../../source/edit/editor/code-model-source-editor.component";

@Component({
  selector: 'code-model-menu',
  standalone: true,
  imports: [
    CollapsibleMenuComponent,
    CodeModelSourceEditorComponent
],
  templateUrl: './code-model-menu.component.html',
  styleUrl: './code-model-menu.component.scss'
})
export class CodeModelMenuComponent extends BaseComponent {

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

    this.menuTitle = "code";
    this.baseHtmlId = "codeModelMenu_CollapsibleMenu";
    this.sourceMenuIsClosed = true;
    this.showBottomPadding = false;
  }

  menuClickedEventHandler(): void {
    this.menuContentToggleEvent.emit(true);
  }

}
