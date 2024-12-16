import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DbModelSourceUrl } from '../../../../../../../entity/model/database/source/url/db-model-source-url';
import { DatabaseModelSourceService } from '../../../../../../../service/model/database/source/db-model-source.service';
import { BaseComponent } from '../../../../../../base.component';
import { CommonModule } from '@angular/common';
import { MenuSelectComponent } from '../../../../../../edit/menu/select/menu-select.component';
import { DbModelSourceUrlEditFormComponent } from "../form/db-model-source-url-edit-form.component";
import { StringUtil } from '../../../../../../../entity/misc/string/util/string-util';

@Component({
  selector: 'db-model-source-url-editor',
  standalone: true,
  imports: [
    CommonModule,
    MenuSelectComponent,
    DbModelSourceUrlEditFormComponent
],
  templateUrl: './db-model-source-url-editor.component.html',
  styleUrl: './db-model-source-url-editor.component.scss'
})
export class DbModelSourceUrlEditorComponent extends BaseComponent implements OnInit {

  urlForEdit$: BehaviorSubject<DbModelSourceUrl | undefined>;

  availableUrls: DbModelSourceUrl[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private dbModelSourceService: DatabaseModelSourceService
  ) {
    super();
    this.urlForEdit$ = new BehaviorSubject<DbModelSourceUrl | undefined>( undefined );
    this.availableUrls = [];
    this.showSelect = true;
    this.baseHtmlId = "dbModelSourceUrlEditor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
  }

  ngOnInit(): void {
    let availableUrlsSubscription = this.dbModelSourceService.getUrls().subscribe({
                                                                            next: (urls: DbModelSourceUrl[] | undefined) => {
                                                                              if (!urls) {
                                                                                throw new Error("Failed to load the available Database Model Source URLs");
                                                                              }
                                                                              this.availableUrls = urls;
                                                                            },
                                                                            error: (err: any) => {
                                                                              throw new Error( "Failed to load the available Database Model Source URLs due to [" + err + "]" );
                                                                            },
                                                                            complete: () => {
                                                                              console.log("Finished loading the available Database Model Source URLs");
                                                                            }
                                                                          });
    this.addLongLivingSubscription(availableUrlsSubscription);
  }

  getAvailableUrlKeys(): string[] {
    return this.availableUrls.map((url: DbModelSourceUrl) => {
      return url.toString();
    });
  }

  loadNewUrlForEdit(): void {
    this.setUrlForEdit(new DbModelSourceUrl());
    this.showSelect = false;
  }

  loadUrlForEdit(fullUrlSelected: string): void {
    if (StringUtil.isNotEmpty(fullUrlSelected)) {
      let urlSelected = this.getUrlFromFullUrl(fullUrlSelected);
      if(!urlSelected) {
        this.resetUrlEdit();
        throw new Error("Unable to find the Database Model Source URL using the Full URL [" + fullUrlSelected + "]");
      }
      this.setUrlForEdit(urlSelected);

    } else {
      console.error( "No Database Model Source URL was selected, unable to load for editing" );
    }
  }

  resetUrlEdit(): void {
    this.setUrlForEdit(undefined);
    this.showSelect = true;
  }

  private setUrlForEdit( sourceUrlForEdit: DbModelSourceUrl | undefined ): void {
    this.urlForEdit$.next(sourceUrlForEdit);
    this.showSelect = false;
  }

  private getUrlFromFullUrl( fullUrl: string ): DbModelSourceUrl | undefined {
    return this.availableUrls.find((availableSourceUrl: DbModelSourceUrl) => {
      return availableSourceUrl.toString() === fullUrl;
    });
  }

}
