import { Component } from "@angular/core";
import { BaseComponent } from "../../../../../base.component";
import { DbModelSourceConfigEditFormComponent } from "../../config/edit/form/db-model-source-config-edit-form.component";
import { DbModelSourceUrlEditFormComponent } from "../../url/edit/form/db-model-source-url-edit-form.component";
import { DbModelSourceUrlEditorComponent } from "../../url/edit/editor/db-model-source-url-editor.component";
import { DbModelSourceUrl } from "../../../../../../entity/model/database/source/url/db-model-source-url";
import { DbModelSourceService } from "../../../../../../service/model/database/source/db-model-source.service";
import { DbModelSourceConfigEditorComponent } from "../../config/edit/editor/db-model-source-config-editor.component";

@Component({
  selector: "db-model-source-editor",
  standalone: true,
  imports: [
    DbModelSourceConfigEditFormComponent,
    DbModelSourceUrlEditFormComponent,
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
