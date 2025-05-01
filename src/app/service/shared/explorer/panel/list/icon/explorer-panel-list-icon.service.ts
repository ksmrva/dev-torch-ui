import { Inject, Injectable, OnInit } from '@angular/core';
import { EXPLORER_PANEL_LIST_ICON_PROVIDER_INJECTION_TOKEN, ExplorerPanelListIconProvider } from './provider/explorer-panel-list-icon-provider';
import { ExplorerPanelListEntry } from '../../../../../../entity/shared/explorer/panel/list/entry/explorer-panel-list-entry';

@Injectable({
  providedIn: 'root'
})
export class ExplorerPanelListIconService implements OnInit {

  private listIconProvidersByType: Map<string, ExplorerPanelListIconProvider>;

  constructor(
    @Inject(EXPLORER_PANEL_LIST_ICON_PROVIDER_INJECTION_TOKEN) private listIconProviders: ExplorerPanelListIconProvider[],
  ) {
    this.listIconProvidersByType = new Map<string, ExplorerPanelListIconProvider>();
    this.listIconProviders.forEach(listIconProvider => {
      this.listIconProvidersByType.set(listIconProvider.getEntryTypeKey(), listIconProvider);
    });
  }

  ngOnInit(): void {

  }

  getIconPathForEntry(entry: ExplorerPanelListEntry): string {
    let iconPathForEntry = "";
    let entryType = entry.type;
    let listIconProviderFound = this.listIconProvidersByType.get(entryType);

    if(listIconProviderFound) {
      iconPathForEntry = listIconProviderFound.getIconPathForEntry(entry);
    } else {
      console.warn("Unable to find any Explorer Panel List Icon Provider using type [" + entryType + "]");
    }

    return iconPathForEntry;
  }

}
