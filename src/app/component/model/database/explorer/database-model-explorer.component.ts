import { Component } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeModelSourceProjectExplorerComponent } from '../../code/source/project/explorer/code-model-source-project-explorer.component';
import { DatabaseModelExplorerHeaderComponent } from './header/database-model-explorer-header.component';
import { DbModelSourceConfigEditorComponent } from '../source/config/edit/editor/db-model-source-config-editor.component';
import { DbModelSourceUrlEditorComponent } from '../source/url/edit/editor/db-model-source-url-editor.component';
import { DbModelMenuComponent } from '../edit/menu/db-model-menu.component';
import { DbModelSourceEditorComponent } from "../source/edit/editor/db-model-source-editor.component";
import { DbModelEditorComponent } from "../edit/editor/db-model-editor.component";

@Component({
  selector: 'database-model-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    DatabaseModelExplorerHeaderComponent,
    DbModelSourceUrlEditorComponent,
    DbModelSourceConfigEditorComponent,
    DbModelSourceEditorComponent,
    DbModelEditorComponent
],
  templateUrl: './database-model-explorer.component.html',
  styleUrl: './database-model-explorer.component.scss'
})
export class DatabaseModelExplorerComponent extends BaseComponent {

  urlExplorerIsClosed: boolean;

  configExplorerIsClosed: boolean;

  databaseExplorerIsClosed: boolean;

  constructor(
  ) {
    super();

    this.urlExplorerIsClosed = true;
    this.configExplorerIsClosed = true;
    this.databaseExplorerIsClosed = true;
  }

  toggleUrlExplorer(): void {
    if(this.isUrlExplorerClosed()) {
      this.openUrlExplorer();

    } else {
      this.closeUrlExplorer();

    }
  }

  toggleConfigExplorer(): void {
    if(this.isConfigExplorerClosed()) {
      this.openConfigExplorer();

    } else {
      this.closeConfigExplorer();

    }
  }

  toggleDatabaseExplorer(): void {
    if(this.isDatabaseExplorerClosed()) {
      this.openDatabaseExplorer();

    } else {
      this.closeDatabaseExplorer();

    }
  }

  isUrlExplorerClosed(): boolean {
    return this.urlExplorerIsClosed;
  }

  isConfigExplorerClosed(): boolean {
    return this.configExplorerIsClosed;
  }

  isDatabaseExplorerClosed(): boolean {
    return this.databaseExplorerIsClosed;
  }

  openUrlExplorer(): void {
    this.urlExplorerIsClosed = false;

    this.closeConfigExplorer();
    this.closeDatabaseExplorer();
  }

  openConfigExplorer(): void {
    this.configExplorerIsClosed = false;

    this.closeUrlExplorer();
    this.closeDatabaseExplorer();
  }

  openDatabaseExplorer(): void {
    this.databaseExplorerIsClosed = false;

    this.closeUrlExplorer();
    this.closeConfigExplorer();
  }

  closeUrlExplorer(): void {
    this.urlExplorerIsClosed = true;
  }

  closeConfigExplorer(): void {
    this.configExplorerIsClosed = true;
  }

  closeDatabaseExplorer(): void {
    this.databaseExplorerIsClosed = true;
  }

}
