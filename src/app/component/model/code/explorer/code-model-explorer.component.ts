import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CodeModelExplorerHeaderComponent } from "./header/code-model-explorer-header.component";
import { CodeModelSourceProjectExplorerComponent } from "../source/project/explorer/code-model-source-project-explorer.component";

@Component({
  selector: 'code-model-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,
    CodeModelExplorerHeaderComponent,
    CodeModelSourceProjectExplorerComponent
],
  templateUrl: './code-model-explorer.component.html',
  styleUrl: './code-model-explorer.component.scss'
})
export class CodeModelExplorerComponent extends BaseComponent {

  projectExplorerIsClosed: boolean;

  constructor(
  ) {
    super();

    this.projectExplorerIsClosed = true;
  }

  toggleProjectExplorer(): void {
    this.projectExplorerIsClosed = !this.projectExplorerIsClosed;
  }

}
