import { Routes } from "@angular/router";
import { ModelMenuComponent } from "./component/model/menu/model-menu.component";
import { DocumentationMenuComponent } from "./component/documentation/menu/documentation-menu.component";

export const routes: Routes = [
  { path: "", redirectTo: "code", pathMatch: "full" },
  { path: "documentation", component: DocumentationMenuComponent },
  { path: "model", component: ModelMenuComponent }
];
