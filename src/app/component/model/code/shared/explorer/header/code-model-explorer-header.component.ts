import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { CodeModelSourceProject } from "../../../../../../entity/model/code/source/project/code-model-source-project";
import { BaseComponent } from "../../../../../shared/base/base.component";
import { CodeModelDetailNavOptionGroupComponent } from "../../../detail/shared/nav/option/group/code-model-detail-nav-option-group.component";
import { CodeModelSourceNavOptionGroupComponent } from "../../../source/shared/nav/option/group/code-model-source-nav-option-group.component";

@Component({
  selector: 'code-model-explorer-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CodeModelSourceNavOptionGroupComponent,
    CodeModelDetailNavOptionGroupComponent
],
  templateUrl: './code-model-explorer-header.component.html',
  styleUrl: './code-model-explorer-header.component.scss'
})
export class CodeModelExplorerHeaderComponent extends BaseComponent implements OnInit {

  @Output() sourceOptionsToggleEvent: EventEmitter<boolean>;

  @Output() detailOptionsToggleEvent: EventEmitter<boolean>;

  @Output() projectSelectedEvent: EventEmitter<CodeModelSourceProject | undefined>;

  closeSourceOptions$: BehaviorSubject<boolean>;

  closeDetailOptions$: BehaviorSubject<boolean>;

  showSourceOptions: boolean;

  showDetailOptions: boolean;

  constructor() {
    super();
    this.sourceOptionsToggleEvent = new EventEmitter<boolean>();
    this.detailOptionsToggleEvent = new EventEmitter<boolean>();
    this.projectSelectedEvent = new EventEmitter<CodeModelSourceProject | undefined>();

    this.closeSourceOptions$ = new BehaviorSubject<boolean>(true);
    this.closeDetailOptions$ = new BehaviorSubject<boolean>(true);
    this.showSourceOptions = false;
    this.showDetailOptions = false;
  }

  ngOnInit(): void {
    this.closeAllOptions();
  }

  handleSourceOptionsToggle(sourceOptionsOpen: boolean): void {
    this.sourceOptionsToggleEvent.emit(sourceOptionsOpen);
    this.closeDetailOptions();
  }

  handleDetailOptionsToggle(detailOptionsOpen: boolean): void {
    this.detailOptionsToggleEvent.emit(detailOptionsOpen);
    this.closeSourceOptions();
  }

  projectSelected(selectedProject: CodeModelSourceProject | undefined): void {
    this.projectSelectedEvent.emit(selectedProject);
  }

  toggleSourceOptions(): void {
    if(this.showSourceOptions) {
      this.closeSourceOptions();

    } else {
      this.closeDetailOptions();
      this.openSourceOptions();

    }
  }

  toggleDetailOptions(): void {
    if(this.showDetailOptions) {
      this.closeDetailOptions();

    } else {
      this.closeSourceOptions();
      this.openDetailOptions();

    }
  }

  openSourceOptions(): void {
    this.showSourceOptions = true;

    this.closeDetailOptions();
  }

  openDetailOptions(): void {
    this.showDetailOptions = true;

    this.closeSourceOptions();
  }

  closeSourceOptions(): void {
    this.showSourceOptions = false;
    this.closeSourceOptions$.next(true);

    this.closeProjectPreview();
  }

  closeDetailOptions(): void {
    this.showDetailOptions = false;
    this.closeDetailOptions$.next(true);
  }

  closeProjectPreview(): void {
    this.projectSelected(undefined);
  }

  closeAllOptions(): void {
    this.closeSourceOptions();
    this.closeDetailOptions();
  }

}
