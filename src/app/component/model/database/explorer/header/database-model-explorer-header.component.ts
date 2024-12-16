import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../../../service/modal/modal.service';

@Component({
  selector: 'database-model-explorer-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule
  ],
  templateUrl: './database-model-explorer-header.component.html',
  styleUrl: './database-model-explorer-header.component.scss'
})
export class DatabaseModelExplorerHeaderComponent extends BaseComponent {

  @Output() urlExplorerToggleEvent: EventEmitter<boolean>;

  @Output() configExplorerToggleEvent: EventEmitter<boolean>;

  @Output() databaseExplorerToggleEvent: EventEmitter<boolean>;

  constructor(
    private modalService: ModalService
  ) {
    super();

    this.urlExplorerToggleEvent = new EventEmitter<boolean>();
    this.configExplorerToggleEvent = new EventEmitter<boolean>();
    this.databaseExplorerToggleEvent = new EventEmitter<boolean>();
  }

  urlExplorerToggleClicked(): void {
    this.urlExplorerToggleEvent.emit(true);
  }

  configExplorerToggleClicked(): void {
    this.configExplorerToggleEvent.emit(true);
  }

  databaseExplorerToggleClicked(): void {
    this.databaseExplorerToggleEvent.emit(true);
  }

}
