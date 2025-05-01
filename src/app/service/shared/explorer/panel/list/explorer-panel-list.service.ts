import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BaseApiService } from '../../../base.api.service';
import { ExplorerPanelListEntry } from '../../../../../entity/shared/explorer/panel/list/entry/explorer-panel-list-entry';

@Injectable({
  providedIn: 'root'
})
export class ExplorerPanelListService extends BaseApiService {

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  override getResourcePathForApiUrl(): string {
    return "/explorer/panel/list";
  }

  getSubEntries(parentEntryId: number, parentEntryType: string): Observable<ExplorerPanelListEntry[] | undefined> {
      return this.getSubEntriesApiCall(parentEntryId, parentEntryType);
    }

  private getSubEntriesApiCall(parentEntryId: number, parentEntryType: string): Observable<ExplorerPanelListEntry[] | undefined> {
    let baseUrl = this.getApiUrlWithAddition("entry/" + parentEntryId + "/sub");
    let fullUrl = this.addQueryParameterToApiUrl(baseUrl, "entryType", parentEntryType);
    return this.httpClient.get<ExplorerPanelListEntry[]>(fullUrl)
                          .pipe(
                            map((getSubEntriesResult: ExplorerPanelListEntry[]) => {
                              let subEntries: ExplorerPanelListEntry[] = [];
                              getSubEntriesResult.forEach((subEntryResult: ExplorerPanelListEntry) => {
                                let subEntry = new ExplorerPanelListEntry().deserialize(
                                  subEntryResult
                                );
                                subEntries.push(subEntry);
                              });
                              return subEntries;
                            }),
                            catchError((error) => {
                              console.log("Failed to get all Explorer Panel List Sub-Entries due to [" + error + "]", error);
                              return of(undefined);
                            })
                          );
  }

}
