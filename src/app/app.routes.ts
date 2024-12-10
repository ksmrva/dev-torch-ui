import { Routes } from "@angular/router";
import { DocumentationViewerComponent } from "./component/documentation/viewer/documentation-viewer.component";
import { ModelViewerComponent } from "./component/model/viewer/model-viewer.component";

export const routes: Routes = [
  { path: "", redirectTo: "code", pathMatch: "full" },
  { path: "documentation", component: DocumentationViewerComponent },
  { path: "model", component: ModelViewerComponent }
];
