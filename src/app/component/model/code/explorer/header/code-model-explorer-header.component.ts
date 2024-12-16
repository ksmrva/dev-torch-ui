import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../../../service/modal/modal.service';

@Component({
  selector: 'code-model-explorer-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule
],
  templateUrl: './code-model-explorer-header.component.html',
  styleUrl: './code-model-explorer-header.component.scss'
})
export class CodeModelExplorerHeaderComponent extends BaseComponent {

  @Output() projectExplorerToggleEvent: EventEmitter<boolean>;

  constructor(
    private modalService: ModalService
  ) {
    super();

    this.projectExplorerToggleEvent = new EventEmitter<boolean>();
  }

  projectExplorerToggleClicked(): void {
    this.projectExplorerToggleEvent.emit(true);
  }

}
