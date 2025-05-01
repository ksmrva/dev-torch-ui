import { Component, Input } from '@angular/core';

@Component({
  selector: 'dev-torch-root-footer',
  standalone: true,
  imports: [],
  templateUrl: './dev-torch-root-footer.component.html',
  styleUrl: './dev-torch-root-footer.component.scss'
})
export class DevTorchRootFooterComponent {

  appVersion: string;

  constructor() {
    // TODO: Fetch this from the package.json file instead, maybe using https://www.npmjs.com/package/genversion
    this.appVersion = "0.0.1";
  }

}
