import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { CodeModelSourceProject } from "../../../../../entity/model/code/source/project/code-model-source-project";
import { BaseComponent } from "../../../../shared/base/base.component";
import { CodeModelSourceProjectPreviewComponent } from "../../source/project/preview/code-model-source-project-preview.component";
import { CodeModelExplorerHeaderComponent } from "./header/code-model-explorer-header.component";

@Component({
  selector: 'code-model-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CodeModelExplorerHeaderComponent,
    CodeModelSourceProjectPreviewComponent
],
  templateUrl: './code-model-explorer.component.html',
  styleUrl: './code-model-explorer.component.scss'
})
export class CodeModelExplorerComponent extends BaseComponent {

  projectForPreview$: BehaviorSubject<CodeModelSourceProject | undefined>;

  showSourceProjectPreview: boolean;

  constructor() {
    super();

    this.projectForPreview$ = new BehaviorSubject<CodeModelSourceProject | undefined>( undefined );
    this.showSourceProjectPreview = false;
  }

  handleSourceOptionsToggle(sourceOptionsOpen: boolean): void {
    // this.showSourceProjectPreview = sourceOptionsOpen;
    if(!sourceOptionsOpen) {
      this.showSourceProjectPreview = false;
    }
  }

  loadProjectForPreview(selectedProject: CodeModelSourceProject | undefined): void {
    if (selectedProject) {
      this.showSourceProjectPreview = true;
    } else {
      this.showSourceProjectPreview = false;
    }
    this.projectForPreview$.next(selectedProject);
  }

}
