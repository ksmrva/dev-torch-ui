import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV } from "../../../../app.constants";
import { BaseComponent } from "../../../shared/base/base.component";
import { CodeModelExplorerComponent } from "../../code/shared/explorer/code-model-explorer.component";
import { DatabaseModelExplorerComponent } from "../../database/shared/explorer/database-model-explorer.component";
import { DomainModelExplorerComponent } from "../../domain/shared/explorer/domain-model-explorer.component";

export const NAV_OPTION_TOGGLE_ACTIVATED_CLASS: string = "toggle-activated";
export const NAV_OPTION_OPENED_TOGGLE_ICON_CLASS: string = "bi-chevron-left";
export const NAV_OPTION_CLOSED_TOGGLE_ICON_CLASS: string = "bi-chevron-right";
export const OPTION_TOGGLE_BUTTON_SELECTED_CLASS: string = "menu-sidebar-button-selected";

@Component({
  selector: 'model-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CodeModelExplorerComponent,
    DatabaseModelExplorerComponent,
    DomainModelExplorerComponent
],
  templateUrl: './model-menu.component.html',
  styleUrl: './model-menu.component.scss'
})
export class ModelMenuComponent extends BaseComponent {

  codeExplorerIsClosed: boolean;

  databaseExplorerIsClosed: boolean;

  domainExplorerIsClosed: boolean;

  additionalContentClasses: string;

  additionalCodeExplorerButtonClasses: string;

  additionalDatabaseExplorerButtonClasses: string;

  additionalDomainExplorerButtonClasses: string;

  constructor() {
    super();

    this.codeExplorerIsClosed = false;
    this.databaseExplorerIsClosed = true;
    this.domainExplorerIsClosed = true;
    this.additionalContentClasses = CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV;
    this.additionalCodeExplorerButtonClasses = OPTION_TOGGLE_BUTTON_SELECTED_CLASS;
    this.additionalDatabaseExplorerButtonClasses = "";
    this.additionalDomainExplorerButtonClasses = "";
  }

  toggleCodeExplorer(): void {
    if(this.isCodeExplorerClosed()) {
      this.openCodeExplorer();

    } else {
      this.closeCodeExplorer();

    }
  }

  toggleDatabaseExplorer(): void {
    if(this.isDatabaseExplorerClosed()) {
      this.openDatabaseExplorer();

    } else {
      this.closeDatabaseExplorer();

    }
  }

  toggleDomainExplorer(): void {
    if(this.isDomainExplorerClosed()) {
      this.openDomainExplorer();

    } else {
      this.closeDomainExplorer();

    }
  }

  isCodeExplorerClosed(): boolean {
    return this.codeExplorerIsClosed;
  }

  isDatabaseExplorerClosed(): boolean {
    return this.databaseExplorerIsClosed;
  }

  isDomainExplorerClosed(): boolean {
    return this.domainExplorerIsClosed;
  }

  openCodeExplorer(): void {
    this.codeExplorerIsClosed = false;
    this.additionalCodeExplorerButtonClasses = OPTION_TOGGLE_BUTTON_SELECTED_CLASS;

    this.closeDatabaseExplorer();
    this.closeDomainExplorer();
  }

  openDatabaseExplorer(): void {
    this.databaseExplorerIsClosed = false;
    this.additionalDatabaseExplorerButtonClasses = OPTION_TOGGLE_BUTTON_SELECTED_CLASS;

    this.closeCodeExplorer();
    this.closeDomainExplorer();
  }

  openDomainExplorer(): void {
    this.domainExplorerIsClosed = false;
    this.additionalDomainExplorerButtonClasses = OPTION_TOGGLE_BUTTON_SELECTED_CLASS;

    this.closeCodeExplorer();
    this.closeDatabaseExplorer();
  }

  closeCodeExplorer(): void {
    this.codeExplorerIsClosed = true;
    this.additionalCodeExplorerButtonClasses = "";
  }

  closeDatabaseExplorer(): void {
    this.databaseExplorerIsClosed = true;
    this.additionalDatabaseExplorerButtonClasses = "";
  }

  closeDomainExplorer(): void {
    this.domainExplorerIsClosed = true;
    this.additionalDomainExplorerButtonClasses = "";
  }

}
