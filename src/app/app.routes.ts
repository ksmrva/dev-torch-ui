import { Routes } from "@angular/router";
import { CanvasViewerComponent } from "./component/canvas/viewer/canvas-viewer.component";
import { JsonViewerComponent } from "./component/model/code/json/viewer/json-viewer.component";
import { CodeModelSourceFileViewerComponent } from "./component/model/code/source/file/viewer/code-model-source-file-viewer.component";

export const routes: Routes = [
  { path: "", redirectTo: "canvas", pathMatch: "full" },
  { path: "canvas", component: CanvasViewerComponent },
  { path: "code", component: CodeModelSourceFileViewerComponent },
  { path: "json", component: JsonViewerComponent }
];
