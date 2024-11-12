import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DbModelSourceUrl } from '../../../../../../../entity/model/database/source/url/db-model-source-url';
import { DbModelSourceService } from '../../../../../../../service/model/database/source/db-model-source.service';
import { BaseComponent } from '../../../../../../base.component';
import { CommonModule } from '@angular/common';
import { MenuSelectComponent } from '../../../../../../edit/menu/select/menu-select.component';
import { DbModelSourceUrlEditFormComponent } from "../form/db-model-source-url-edit-form.component";
import { StringUtil } from '../../../../../../../entity/helper/string/util/string-util';

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

  sourceUrlForEdit$: BehaviorSubject<DbModelSourceUrl | undefined>;

  availableSourceUrls: DbModelSourceUrl[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private dbModelSourceService: DbModelSourceService
  ) {
    super();
    this.sourceUrlForEdit$ = new BehaviorSubject<DbModelSourceUrl | undefined>( undefined );
    this.availableSourceUrls = [];
    this.showSelect = true;
    this.baseHtmlId = "dbModelSourceUrlEditor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
  }

  ngOnInit(): void {
    let availableSourceUrlsSubscription = this.dbModelSourceService.getSourceUrls().subscribe({
                                                                                        next: (sourceUrls: DbModelSourceUrl[] | undefined) => {
                                                                                          if (!sourceUrls) {
                                                                                            throw new Error("Failed to load the available Database Model Source URLs");
                                                                                          }
                                                                                          this.availableSourceUrls = sourceUrls;
                                                                                        },
                                                                                        error: (err: any) => {
                                                                                          throw new Error( "Failed to load the available Database Model Source URLs due to [" + err + "]" );
                                                                                        },
                                                                                        complete: () => {
                                                                                          console.log("Finished loading the available Database Model Source URLs");
                                                                                        }
                                                                                      });
    this.addLongLivingSubscription(availableSourceUrlsSubscription);
  }

  getAvailableSourceUrlKeys(): string[] {
    return this.availableSourceUrls.map((sourceUrl: DbModelSourceUrl) => {
      return sourceUrl.toString();
    });
  }

  loadNewSourceUrlForEdit(): void {
    this.setSourceUrlForEdit(new DbModelSourceUrl());
    this.showSelect = false;
  }

  loadSourceUrlForEdit(fullUrlSelected: string): void {
    if (StringUtil.isNotEmpty(fullUrlSelected)) {
      let sourceUrlSelected = this.getSourceUrlFromFullUrl(fullUrlSelected);
      if(!sourceUrlSelected) {
        this.resetSourceUrlEdit();
        throw new Error("Unable to find the Database Model Source URL using the Full URL [" + fullUrlSelected + "]");
      }
      this.setSourceUrlForEdit(sourceUrlSelected);

    } else {
      console.error( "No Database Model Source URL was selected, unable to load for editing" );
    }
  }

  resetSourceUrlEdit(): void {
    this.setSourceUrlForEdit(undefined);
    this.showSelect = true;
  }

  private setSourceUrlForEdit( sourceUrlForEdit: DbModelSourceUrl | undefined ): void {
    this.sourceUrlForEdit$.next(sourceUrlForEdit);
    this.showSelect = false;
  }

  private getSourceUrlFromFullUrl( fullUrl: string ): DbModelSourceUrl | undefined {
    return this.availableSourceUrls.find((availableSourceUrl: DbModelSourceUrl) => {
      return availableSourceUrl.toString() === fullUrl;
    });
  }

}
