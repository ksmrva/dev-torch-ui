import { Component } from '@angular/core';
import { DomainModelExplorerHeaderComponent } from "./header/domain-model-explorer-header.component";

@Component({
  selector: 'domain-model-explorer',
  standalone: true,
  imports: [
    DomainModelExplorerHeaderComponent
  ],
  templateUrl: './domain-model-explorer.component.html',
  styleUrl: './domain-model-explorer.component.scss'
})
export class DomainModelExplorerComponent {

}
