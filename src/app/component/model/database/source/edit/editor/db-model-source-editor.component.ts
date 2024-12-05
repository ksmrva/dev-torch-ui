import { Component } from "@angular/core";
import { BaseComponent } from "../../../../../base.component";
import { DbModelSourceUrlEditorComponent } from "../../url/edit/editor/db-model-source-url-editor.component";
import { DbModelSourceConfigEditorComponent } from "../../config/edit/editor/db-model-source-config-editor.component";

@Component({
  selector: "db-model-source-editor",
  standalone: true,
  imports: [
    DbModelSourceUrlEditorComponent,
    DbModelSourceConfigEditorComponent
],
  templateUrl: "./db-model-source-editor.component.html",
  styleUrl: "./db-model-source-editor.component.scss"
})
export class DbModelSourceEditorComponent extends BaseComponent {

  constructor() {
    super();
  }

}
