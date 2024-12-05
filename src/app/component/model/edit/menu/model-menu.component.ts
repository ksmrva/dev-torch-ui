import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollapsibleMenuComponent } from '../../../edit/menu/collapsible/collapsible-menu.component';
import { BaseComponent } from '../../../base.component';
import { DbModelMenuComponent } from "../../database/edit/menu/db-model-menu.component";
import { CodeModelMenuComponent } from "../../code/edit/menu/code-model-menu.component";

@Component({
  selector: 'model-menu',
  standalone: true,
  imports: [
    CollapsibleMenuComponent,
    DbModelMenuComponent,
    CodeModelMenuComponent
],
  templateUrl: './model-menu.component.html',
  styleUrl: './model-menu.component.scss'
})
export class ModelMenuComponent extends BaseComponent {

  @Input() menuContentIsClosed: boolean;

  @Output() menuToggleEvent: EventEmitter<boolean>;

  menuTitle: string;

  baseHtmlId: string;

  collapsibleMenuBaseHtmlId: string;

  databaseMenuIsClosed: boolean;

  codeMenuIsClosed: boolean;

  showBottomPadding: boolean;

  constructor() {
    super();
    this.menuContentIsClosed = true;
    this.menuToggleEvent = new EventEmitter<boolean>();

    this.menuTitle = "model";
    this.baseHtmlId = "modelMenu";
    this.collapsibleMenuBaseHtmlId = this.baseHtmlId + "_CollapsibleMenu";

    this.databaseMenuIsClosed = true;
    this.codeMenuIsClosed = true;
    this.showBottomPadding = false;
  }

  menuToggleClicked(): void {
    this.menuToggleEvent.emit(true);
  }

  databaseMenuToggleClicked(): void {
    if (this.databaseMenuIsClosed) {
      this.databaseMenuIsClosed = false;

      this.codeMenuIsClosed = true;
      this.showBottomPadding = false;

    } else {
      this.databaseMenuIsClosed = true;

      this.showBottomPadding = false;
    }
  }

  codeMenuToggleClicked(): void {
    if (this.codeMenuIsClosed) {
      this.codeMenuIsClosed = false;

      this.databaseMenuIsClosed = true;
      this.showBottomPadding = true;

    } else {
      this.codeMenuIsClosed = true;

      this.showBottomPadding = false;
    }
  }

}
