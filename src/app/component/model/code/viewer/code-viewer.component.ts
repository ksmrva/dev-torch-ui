import { Component } from "@angular/core";
import { BaseComponent } from "../../../base.component";

@Component({
  selector: "code-viewer",
  standalone: true,
  imports: [],
  templateUrl: "./code-viewer.component.html",
  styleUrl: "./code-viewer.component.scss"
})
export class CodeViewerComponent extends BaseComponent {
  constructor() {
    super();
  }
}
