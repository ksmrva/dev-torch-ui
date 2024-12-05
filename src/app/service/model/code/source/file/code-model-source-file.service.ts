import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, map, catchError, tap } from "rxjs";
import { StringUtil } from "../../../../../entity/helper/string/util/string-util";
import { CodeModelSourceFile } from "../../../../../entity/model/code/source/file/code-model-source-file";
import { BaseApiService } from "../../../../base.api.service";
import { CodeModelSourceFileTreeNode } from "../../../../../entity/model/code/source/file/tree/node/code-model-source-file-tree-node";
import { CodeModelSourceFileCodeExtension } from "../../../../../entity/model/code/source/file/extension/code-model-source-file-code-extension";

@Injectable({
  providedIn: 'root'
})
export class CodeModelSourceFileService extends BaseApiService {

  private files$: BehaviorSubject<CodeModelSourceFile[]>;

  private childNodesByParentId$: BehaviorSubject<Map<number, CodeModelSourceFileTreeNode[]>>;

  private codeExtensions$: BehaviorSubject<CodeModelSourceFileCodeExtension[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.files$ = new BehaviorSubject<CodeModelSourceFile[]>([]);
    this.childNodesByParentId$ = new BehaviorSubject<Map<number, CodeModelSourceFileTreeNode[]>>(new Map());
    this.codeExtensions$ = new BehaviorSubject<CodeModelSourceFileCodeExtension[]>([]);

    this.initCodeExtensions();
  }

  getFiles(): Observable<CodeModelSourceFile[]> {
    return this.files$.asObservable();
  }

  getCodeExtensions(): Observable<CodeModelSourceFileCodeExtension[]> {
    return this.codeExtensions$.asObservable();
  }

  getFile(fileIdToGet: number): Observable<CodeModelSourceFile | undefined> {
    let fileResult: Observable<CodeModelSourceFile | undefined>;

    let loadedFile = this.getFileFromCache(fileIdToGet);
    if (loadedFile) {
      fileResult = of(loadedFile);

    } else {
      console.info("Code Model Source File with ID [" + fileIdToGet + "] not found within cache, fetching from API");
      fileResult = this.getFileApiCall(fileIdToGet);

    }
    return fileResult;
  }

  getChildNodes(parentNodeId: number): Observable<CodeModelSourceFileTreeNode[] | undefined> {
    let childNodesResult: Observable<CodeModelSourceFileTreeNode[] | undefined>;
    let loadedChildNodes = this.childNodesByParentId$.value.get(parentNodeId);
    if (loadedChildNodes) {
      childNodesResult = of(loadedChildNodes);
    } else {
      console.info("Child File Tree Nodes not found for Parent ID [" + parentNodeId + "]");
      childNodesResult = this.getChildNodesApiCall(parentNodeId);
    }
    return childNodesResult;
  }

  extractFileExtension(file: CodeModelSourceFile): string | undefined {
    let fileExtension = undefined;
    if(file) {
      fileExtension = this.extractFileExtensionFromName(file.name);
    }
    return fileExtension;
  }

  extractFileExtensionFromName(fileName: string): string | undefined {
    let fileExtension = undefined;
    if(fileName) {
      let indexOfLastPeriod = fileName.lastIndexOf(".");
      if(indexOfLastPeriod > 0 && indexOfLastPeriod < fileName.length) {
        fileExtension = fileName.substring(indexOfLastPeriod + 1);
      }
    }
    return fileExtension;
  }

  protected override getResourcePathForApiUrl(): string {
    return "/model/code/source/file";
  }

  private initCodeExtensions(): void {
    this.getAllCodeExtensionsApiCall().subscribe({
                                            next: (codeExtensions: CodeModelSourceFileCodeExtension[] | undefined) => {
                                              if (!codeExtensions) {
                                                throw new Error("Failed to initialize the Code Model Source File Code Extensions");
                                              }
                                            },
                                            error: (err: any) => {
                                              throw new Error("Failed to initialize the Code Model Source File Code Extensions due to [" + err + "]");
                                            },
                                            complete: () => {
                                              console.log("Finished initializing Code Model Source File Code Extensions");
                                            }
                                          });
  }

  private getFileFromCache(fileIdToGet: number): CodeModelSourceFile | undefined {
    return this.files$.value.find((file: CodeModelSourceFile) => {
      return file.id === fileIdToGet;
    });
  }

  private addCodeExtension(codeExtensionToAdd: CodeModelSourceFileCodeExtension): void {
    if (
      codeExtensionToAdd
      && StringUtil.isNotEmpty(codeExtensionToAdd.extension)
    ) {
      let codeExtensionAlreadyAdded = this.codeExtensions$.value.find((codeExtension: CodeModelSourceFileCodeExtension) => {
        return codeExtension.isEqualTo(codeExtensionToAdd);
      });
      if (!codeExtensionAlreadyAdded) {
        this.codeExtensions$.next([...this.codeExtensions$.value, codeExtensionToAdd]);
      }
    }
  }

  private addFile(fileToAdd: CodeModelSourceFile): void {
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
      console.log("Null, undefined, or invalid Code Model Source File ID was provided to add to cache, ignoring" );
    }
  }

  private setChildNodesForParentId(childNodesToSet: CodeModelSourceFileTreeNode[], parentId: number): void {
    if (childNodesToSet) {
      this.childNodesByParentId$.value.set(parentId, childNodesToSet);
    } else {
      console.log("Null, undefined, or invalid Child File Tree Nodes array was provided to add to cache, ignoring" );
    }
  }

  private getFileApiCall(fileIdToGet: number): Observable<CodeModelSourceFile | undefined> {
    return this.httpClient.get<CodeModelSourceFile>(this.getApiUrlWithAddition(fileIdToGet.toString()))
                          .pipe(
                            map((fileResult: CodeModelSourceFile) => {
                              return new CodeModelSourceFile().deserialize(fileResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to get Code Model Source File with ID [" + fileIdToGet + "] due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((file: CodeModelSourceFile | undefined) => {
                              if (file) {
                                this.addFile(file);
                              }
                            })
                          );
  }

  private getChildNodesApiCall(parentNodeId: number): Observable<CodeModelSourceFileTreeNode[] | undefined> {
    return this.httpClient.get<CodeModelSourceFileTreeNode[]>(this.getApiUrlWithAddition("node/" + parentNodeId.toString() + "/children"))
                          .pipe(
                            map((childNodesResult: CodeModelSourceFileTreeNode[]) => {
                              let childNodes: CodeModelSourceFileTreeNode[] = [];
                              childNodesResult.forEach((childNodeResult: CodeModelSourceFileTreeNode) => {
                                childNodes.push(new CodeModelSourceFileTreeNode().deserialize(childNodeResult));
                              });
                              return childNodes;
                            }),
                            catchError((error) => {
                              console.error("Failed to get Child File Tree Nodes using Parent ID [" + parentNodeId + "] due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((childNodes: CodeModelSourceFileTreeNode[] | undefined) => {
                              if (childNodes) {
                                this.setChildNodesForParentId(childNodes, parentNodeId);
                              }
                            })
                          );
  }

  private getAllCodeExtensionsApiCall(): Observable<CodeModelSourceFileCodeExtension[] | undefined> {
    return this.httpClient.get<CodeModelSourceFileCodeExtension[]>(this.getApiUrlWithAddition("code/extension"))
                          .pipe(
                            map((getAllCodeExtensionsResult: CodeModelSourceFileCodeExtension[]) => {
                              let codeExtensions: CodeModelSourceFileCodeExtension[] = [];
                              getAllCodeExtensionsResult.forEach((codeExtensionResult: CodeModelSourceFileCodeExtension) => {
                                codeExtensions.push(new CodeModelSourceFileCodeExtension().deserialize(codeExtensionResult));
                              });
                              return codeExtensions;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all Code Model Source File Code Extensions due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((allCodeExtensions: CodeModelSourceFileCodeExtension[] | undefined) => {
                              if (allCodeExtensions) {
                                allCodeExtensions.forEach((codeExtension: CodeModelSourceFileCodeExtension) => {
                                  this.addCodeExtension(codeExtension);
                                });
                              }
                            })
                          );
  }

}
