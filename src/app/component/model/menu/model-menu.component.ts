import { Component } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV } from '../../../app.constants';
import { CodeModelExplorerComponent } from '../code/explorer/code-model-explorer.component';
import { DatabaseModelExplorerComponent } from '../database/explorer/database-model-explorer.component';

@Component({
  selector: 'model-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CodeModelExplorerComponent,
    DatabaseModelExplorerComponent
  ],
  templateUrl: './model-menu.component.html',
  styleUrl: './model-menu.component.scss'
})
export class ModelMenuComponent extends BaseComponent {

  codeExplorerIsClosed: boolean;

  databaseExplorerIsClosed: boolean;

  // databaseMenuIsClosed: boolean;

  jsonExplorerIsClosed: boolean;

  modelContentClass: string;

  additionalCodeExplorerButtonClasses: string;

  additionalDatabaseExplorerButtonClasses: string;

  additionalJsonExplorerButtonClasses: string;

  constructor() {
    super();
    this.modelContentClass = CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV;

    this.codeExplorerIsClosed = true;
    this.databaseExplorerIsClosed = true;
    // this.databaseMenuIsClosed = true;
    this.jsonExplorerIsClosed = true;
    this.additionalCodeExplorerButtonClasses = "";
    this.additionalDatabaseExplorerButtonClasses = "";
    this.additionalJsonExplorerButtonClasses = "";
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

  // toggleDatabaseMenu(): void {
  //   if(this.isDatabaseMenuClosed()) {
  //     this.openDatabaseMenu();

  //   } else {
  //     this.closeDatabaseMenu();

  //   }
  // }

  toggleJsonExplorer(): void {
    if(this.isJsonExplorerClosed()) {
      this.openJsonExplorer();

    } else {
      this.closeJsonExplorer();

    }
  }

  isCodeExplorerClosed(): boolean {
    return this.codeExplorerIsClosed;
  }

  isDatabaseExplorerClosed(): boolean {
    return this.databaseExplorerIsClosed;
  }

  // isDatabaseMenuClosed(): boolean {
  //   return this.databaseMenuIsClosed;
  // }

  isJsonExplorerClosed(): boolean {
    return this.jsonExplorerIsClosed;
  }

  openCodeExplorer(): void {
    this.codeExplorerIsClosed = false;
    this.additionalCodeExplorerButtonClasses = "model-menu-sidebar-option-toggle-button-selected";

    this.closeDatabaseExplorer();
    this.closeJsonExplorer();
  }

  openDatabaseExplorer(): void {
    this.databaseExplorerIsClosed = false;
    this.additionalDatabaseExplorerButtonClasses = "model-menu-sidebar-option-toggle-button-selected";

    this.closeCodeExplorer();
    this.closeJsonExplorer();
  }

  // openDatabaseMenu(): void {
  //   this.openDatabaseMenu();
  //   this.databaseMenuIsClosed = false;
  // }

  openJsonExplorer(): void {
    this.jsonExplorerIsClosed = false;
    this.additionalJsonExplorerButtonClasses = "model-menu-sidebar-option-toggle-button-selected";

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

  // closeDatabaseMenu(): void {
  //   this.databaseMenuIsClosed = true;
  // }

  closeJsonExplorer(): void {
    this.jsonExplorerIsClosed = true;
    this.additionalJsonExplorerButtonClasses = "";
  }

  addHighlightToTab(): void {

  }

}
