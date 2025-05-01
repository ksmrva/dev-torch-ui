import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { DevTorchRootHeaderComponent } from "./header/dev-torch-root-header.component";
import { DevTorchRootFooterComponent } from "./footer/dev-torch-root-footer.component";

@Component({
  selector: "dev-torch-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DevTorchRootHeaderComponent,
    DevTorchRootFooterComponent
],
  templateUrl: "./dev-torch-root.component.html",
  styleUrl: "./dev-torch-root.component.scss"
})
export class DevTorchRootComponent {

}
