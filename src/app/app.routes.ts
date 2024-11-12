import { Routes } from "@angular/router";
import { CanvasViewerComponent } from "./component/canvas/viewer/canvas-viewer.component";
import { JsonViewerComponent } from "./component/model/code/json/viewer/json-viewer.component";
import { CodeViewerComponent } from "./component/model/code/viewer/code-viewer.component";

export const routes: Routes = [
  { path: "", redirectTo: "canvas", pathMatch: "full" },
  { path: "canvas", component: CanvasViewerComponent },
  { path: "code", component: CodeViewerComponent },
  { path: "json", component: JsonViewerComponent }
];
