import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../../base.component';
import { CollapsibleMenuComponent } from "../../../../../edit/menu/collapsible/collapsible-menu.component";
import { CodeModelSourceEditorComponent } from "../editor/code-model-source-editor.component";

@Component({
  selector: 'code-model-source-menu',
  standalone: true,
  imports: [CollapsibleMenuComponent, CodeModelSourceEditorComponent],
  templateUrl: './code-model-source-menu.component.html',
  styleUrl: './code-model-source-menu.component.scss'
})
export class CodeModelSourceMenuComponent extends BaseComponent {

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
    this.baseHtmlId = "codeModelSourceMenu";
    this.collapsibleMenuBaseHtmlId = this.baseHtmlId + "_CollapsibleMenu";
    this.showBottomPadding = false;
  }

  menuClickedEventHandler(): void {
    this.menuToggleEvent.emit(true);
  }

}
