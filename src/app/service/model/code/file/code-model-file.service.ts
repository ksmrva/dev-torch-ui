import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../base.api.service';
import { HttpClient } from '@angular/common/http';
import { CodeFileType } from '../../../../entity/model/code/file/type/code-file-type';
import { BehaviorSubject, Observable, map, catchError, of, tap } from 'rxjs';
import { StringUtil } from '../../../../entity/helper/string/util/string-util';
import { CodeFile } from '../../../../entity/model/code/file/code-file';
import { CodeFileNode } from '../../../../entity/model/code/file/node/code-file-node';
import { CodeFileFactory } from '../../../../entity/model/code/file/factory/code-file-factory';

@Injectable({
  providedIn: 'root'
})
export class CodeModelFileService extends BaseApiService {

  private files$: BehaviorSubject<CodeFile[]>;

  private childNodesByParentId$: BehaviorSubject<Map<number, CodeFileNode[]>>;

  private fileTypes$: BehaviorSubject<CodeFileType[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.files$ = new BehaviorSubject<CodeFile[]>([]);
    this.childNodesByParentId$ = new BehaviorSubject<Map<number, CodeFileNode[]>>(new Map());
    this.fileTypes$ = new BehaviorSubject<CodeFileType[]>([]);

    this.initFileTypes();
  }

  getFiles(): Observable<CodeFile[]> {
    return this.files$.asObservable();
  }

  getFileTypes(): Observable<CodeFileType[]> {
    return this.fileTypes$.asObservable();
  }

  getFile(fileIdToGet: number): Observable<CodeFile | undefined> {
    let fileResult: Observable<CodeFile | undefined>;

    let loadedFile = this.getFileFromCache(fileIdToGet);
    if (loadedFile) {
      fileResult = of(loadedFile);

    } else {
      console.info("Code File with ID [" + fileIdToGet + "] not found within cache, fetching from API");
      fileResult = this.getFileApiCall(fileIdToGet);

    }
    return fileResult;
  }

  getChildNodes(parentNodeId: number): Observable<CodeFileNode[] | undefined> {
    let childNodesResult: Observable<CodeFileNode[] | undefined>;
    let loadedChildNodes = this.childNodesByParentId$.value.get(parentNodeId);
    if (loadedChildNodes) {
      childNodesResult = of(loadedChildNodes);
    } else {
      console.info("Child File Nodes not found for Parent ID [" + parentNodeId + "]");
      childNodesResult = this.getChildNodesApiCall(parentNodeId);
    }
    return childNodesResult;
  }

  protected override getResourcePathForApiUrl(): string {
    return "/model/code/file";
  }

  private initFileTypes(): void {
    this.getAllFileTypesApiCall().subscribe({
                                            next: (fileTypes: CodeFileType[] | undefined) => {
                                              if (!fileTypes) {
                                                throw new Error("Failed to initialize the Code File Types");
                                              }
                                            },
                                            error: (err: any) => {
                                              throw new Error("Failed to initialize the Code File Types due to [" + err + "]");
                                            },
                                            complete: () => {
                                              console.log("Finished initializing Code File Types");
                                            }
                                          });
  }

  private getFileFromCache(fileIdToGet: number): CodeFile | undefined {
    return this.files$.value.find((file: CodeFile) => {
      return file.id === fileIdToGet;
    });
  }

  private addFileType(fileTypeToAdd: CodeFileType): void {
    if (
      fileTypeToAdd
      && StringUtil.isNotEmpty(fileTypeToAdd.name)
    ) {
      let fileTypeAlreadyAdded = this.fileTypes$.value.find((fileType: CodeFileType) => {
        return fileType.isEqualTo(fileTypeToAdd);
      });
      if (!fileTypeAlreadyAdded) {
        this.fileTypes$.next([...this.fileTypes$.value, fileTypeToAdd]);
      }
    }
  }

  private addFile(fileToAdd: CodeFile): void {
    if (fileToAdd) {
      let fileId = fileToAdd.id;
      if (
        fileId !== undefined
        && fileId !== null
        && fileId > 0
      ) {
        if (!this.getFileFromCache(fileId)) {
          this.files$.next([...this.files$.value, fileToAdd]);
        }
      }
    } else {
      console.log( "Null, undefined, or invalid Code File ID was provided to add with the Code Model File Service, ignoring" );
    }
  }

  private setChildNodesForParentId(childNodesToSet: CodeFileNode[], parentId: number): void {
    if (childNodesToSet) {
      this.childNodesByParentId$.value.set(parentId, childNodesToSet);
    } else {
      console.log( "Null, undefined, or invalid Code File Child Nodes array was provided to add with the Code Model File Service, ignoring" );
    }
  }

  private getFileApiCall(fileIdToGet: number): Observable<CodeFile | undefined> {
    return this.httpClient.get<CodeFile>(this.getApiUrlWithAddition(fileIdToGet.toString()))
                          .pipe(
                            map((fileResult: CodeFile) => {
                              return CodeFileFactory.createCodeFile(fileResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to get Code File with ID [" + fileIdToGet + "] due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((file: CodeFile | undefined) => {
                              if (file) {
                                this.addFile(file);
                              }
                            })
                          );
  }

  private getChildNodesApiCall(parentNodeId: number): Observable<CodeFileNode[] | undefined> {
    return this.httpClient.get<CodeFileNode[]>(this.getApiUrlWithAddition("node/" + parentNodeId.toString() + "/children"))
                          .pipe(
                            map((childNodesResult: CodeFileNode[]) => {
                              let childNodes: CodeFileNode[] = [];
                              childNodesResult.forEach((childNodeResult: CodeFileNode) => {
                                childNodes.push(new CodeFileNode().deserialize(childNodeResult));
                              });
                              return childNodes;
                            }),
                            catchError((error) => {
                              console.error("Failed to get Code File Node Children with Parent ID [" + parentNodeId + "] due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((childNodes: CodeFileNode[] | undefined) => {
                              if (childNodes) {
                                this.setChildNodesForParentId(childNodes, parentNodeId);
                              }
                            })
                          );
  }

  private getAllFileTypesApiCall(): Observable<CodeFileType[] | undefined> {
    return this.httpClient.get<CodeFileType[]>(this.getApiUrlWithAddition("type"))
                          .pipe(
                            map((getAllFileTypesResult: CodeFileType[]) => {
                              let fileTypes: CodeFileType[] = [];
                              getAllFileTypesResult.forEach((fileTypeResult: CodeFileType) => {
                                fileTypes.push(new CodeFileType().deserialize(fileTypeResult));
                              });
                              return fileTypes;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all Code File Types due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((allFileTypes: CodeFileType[] | undefined) => {
                              if (allFileTypes) {
                                allFileTypes.forEach((fileType: CodeFileType) => {
                                  this.addFileType(fileType);
                                });
                              }
                            })
                          );
  }

}
