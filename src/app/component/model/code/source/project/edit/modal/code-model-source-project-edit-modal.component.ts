import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Canvas } from '../../../../../../../entity/documentation/tool/canvas/canvas';
import { StringUtil } from '../../../../../../../entity/misc/string/util/string-util';
import { CanvasService } from '../../../../../../../service/documentation/tool/canvas/canvas.service';
import { CanvasEditFormComponent } from '../../../../../../documentation/tool/canvas/edit/form/canvas-edit-form.component';
import { MenuSelectComponent } from '../../../../../../edit/menu/select/menu-select.component';
import { ModalComponent } from '../../../../../../modal/modal.component';
import { CodeModelSourceProjectEditorComponent } from "../editor/code-model-source-project-editor.component";

@Component({
  selector: 'code-model-source-project-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    CodeModelSourceProjectEditorComponent
],
  templateUrl: './code-model-source-project-edit-modal.component.html',
  styleUrl: './code-model-source-project-edit-modal.component.scss'
})
export class CodeModelSourceProjectEditModalComponent extends BaseComponent {

  @Input() baseHtmlId: string;

  modalTitle: string;

  constructor() {
    super();

    this.baseHtmlId = "";
    this.modalTitle = "edit project";
  }

}
