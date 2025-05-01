import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseModelExplorerHeaderComponent } from './header/database-model-explorer-header.component';
import { BaseComponent } from '../../../../shared/base/base.component';

@Component({
  selector: 'database-model-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    DatabaseModelExplorerHeaderComponent
],
  templateUrl: './database-model-explorer.component.html',
  styleUrl: './database-model-explorer.component.scss'
})
export class DatabaseModelExplorerComponent extends BaseComponent {

  urlExplorerIsClosed: boolean;

  configExplorerIsClosed: boolean;

  sqlDatabaseExplorerIsClosed: boolean;

  constructor(
  ) {
    super();

    this.urlExplorerIsClosed = true;
    this.configExplorerIsClosed = true;
    this.sqlDatabaseExplorerIsClosed = true;
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

  toggleSqlDatabaseExplorer(): void {
    if(this.isSqlDatabaseExplorerClosed()) {
      this.openSqlDatabaseExplorer();

    } else {
      this.closeSqlDatabaseExplorer();

    }
  }

  isUrlExplorerClosed(): boolean {
    return this.urlExplorerIsClosed;
  }

  isConfigExplorerClosed(): boolean {
    return this.configExplorerIsClosed;
  }

  isSqlDatabaseExplorerClosed(): boolean {
    return this.sqlDatabaseExplorerIsClosed;
  }

  openUrlExplorer(): void {
    this.urlExplorerIsClosed = false;

    this.closeConfigExplorer();
    this.closeSqlDatabaseExplorer();
  }

  openConfigExplorer(): void {
    this.configExplorerIsClosed = false;

    this.closeUrlExplorer();
    this.closeSqlDatabaseExplorer();
  }

  openSqlDatabaseExplorer(): void {
    this.sqlDatabaseExplorerIsClosed = false;

    this.closeUrlExplorer();
    this.closeConfigExplorer();
  }

  closeUrlExplorer(): void {
    this.urlExplorerIsClosed = true;
  }

  closeConfigExplorer(): void {
    this.configExplorerIsClosed = true;
  }

  closeSqlDatabaseExplorer(): void {
    this.sqlDatabaseExplorerIsClosed = true;
  }

}
