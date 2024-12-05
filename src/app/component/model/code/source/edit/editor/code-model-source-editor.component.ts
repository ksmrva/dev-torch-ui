import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../base.component';
import { CodeModelSourceProjectEditorComponent } from "../../project/edit/editor/code-model-source-project-editor.component";

@Component({
  selector: 'code-model-source-editor',
  standalone: true,
  imports: [CodeModelSourceProjectEditorComponent],
  templateUrl: './code-model-source-editor.component.html',
  styleUrl: './code-model-source-editor.component.scss'
})
export class CodeModelSourceEditorComponent extends BaseComponent {

  constructor() {
    super();
  }

}
