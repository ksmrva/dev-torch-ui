import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BaseComponent } from "../../../../../shared/base/base.component";
import { DatabaseModelSourceNavOptionGroupComponent } from "../../../source/shared/nav/option/group/database-model-source-nav-option-group.component";
import { DbModelSourceConfig } from "../../../../../../entity/model/database/source/config/db-model-source-config";
import { BehaviorSubject } from "rxjs";
import { DatabaseModelDetailNavOptionGroupComponent } from "../../../detail/shared/nav/option/group/database-model-detail-nav-option-group.component";

@Component({
  selector: 'database-model-explorer-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    DatabaseModelSourceNavOptionGroupComponent,
    DatabaseModelDetailNavOptionGroupComponent
  ],
  templateUrl: './database-model-explorer-header.component.html',
  styleUrl: './database-model-explorer-header.component.scss'
})
export class DatabaseModelExplorerHeaderComponent extends BaseComponent {

  @Output() sourceOptionsToggleEvent: EventEmitter<boolean>;

  @Output() detailOptionsToggleEvent: EventEmitter<boolean>;

  @Output() configSelectedEvent: EventEmitter<DbModelSourceConfig | undefined>;

  closeSourceOptions$: BehaviorSubject<boolean>;

  closeDetailOptions$: BehaviorSubject<boolean>;

  showSourceOptions: boolean;

  showDetailOptions: boolean;

  constructor() {
    super();
    this.sourceOptionsToggleEvent = new EventEmitter<boolean>();
    this.detailOptionsToggleEvent = new EventEmitter<boolean>();
    this.configSelectedEvent = new EventEmitter<DbModelSourceConfig | undefined>();

    this.closeSourceOptions$ = new BehaviorSubject<boolean>(true);
    this.closeDetailOptions$ = new BehaviorSubject<boolean>(true);
    this.showSourceOptions = false;
    this.showDetailOptions = false;
  }

  handleSourceOptionsToggle(sourceOptionsOpen: boolean): void {
    this.sourceOptionsToggleEvent.emit(sourceOptionsOpen);
    this.closeDetailOptions();
  }

  handleDetailOptionsToggle(detailOptionsOpen: boolean): void {
    this.detailOptionsToggleEvent.emit(detailOptionsOpen);
    this.closeSourceOptions();
  }

  configSelected(selectedConfig: DbModelSourceConfig | undefined): void {
    this.configSelectedEvent.emit(selectedConfig);
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
  }

  closeDetailOptions(): void {
    this.showDetailOptions = false;
    this.closeDetailOptions$.next(true);
  }

  closeAllOptions(): void {
    this.closeSourceOptions();
    this.closeDetailOptions();
  }

}
