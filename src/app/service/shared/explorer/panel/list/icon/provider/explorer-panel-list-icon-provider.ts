import { InjectionToken } from "@angular/core";
import { ExplorerPanelListEntry } from "../../../../../../../entity/shared/explorer/panel/list/entry/explorer-panel-list-entry";

export const EXPLORER_PANEL_LIST_ICON_PROVIDER_INJECTION_TOKEN = new InjectionToken<ExplorerPanelListIconProvider>('ExplorerPanelListIconProvider');

export interface ExplorerPanelListIconProvider {
  getEntryTypeKey(): string;

  getIconPathForEntry(entry: ExplorerPanelListEntry): string;
}
