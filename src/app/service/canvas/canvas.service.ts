import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, of, tap } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { CanvasCustomCell } from "../../entity/canvas/cell/custom/canvas-custom-cell";
import { Canvas } from "../../entity/canvas/canvas";
import { CanvasLinkCell } from "../../entity/canvas/cell/link/canvas-link-cell";
import { BaseApiService } from "../base.api.service";

@Injectable({
  providedIn: "root"
})
export class CanvasService extends BaseApiService {

  private loadedCanvases: Map<string, Canvas>;

  private availableCanvasNames$: BehaviorSubject<string[]>;

  private canvasWasUpdated$: BehaviorSubject<Canvas | undefined>;

  private canvasCustomCellWasUpdated$: BehaviorSubject<CanvasCustomCell | undefined>;

  private canvasLinkCellWasUpdated$: BehaviorSubject<CanvasLinkCell | undefined>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.loadedCanvases = new Map<string, Canvas>();
    this.availableCanvasNames$ = new BehaviorSubject<string[]>([]);
    this.canvasWasUpdated$ = new BehaviorSubject<Canvas | undefined>(undefined);
    this.canvasCustomCellWasUpdated$ = new BehaviorSubject<CanvasCustomCell | undefined>(undefined);
    this.canvasLinkCellWasUpdated$ = new BehaviorSubject<CanvasLinkCell | undefined>(undefined);

    this.initCanvases();
  }

  getAvailableCanvasNames(): Observable<string[]> {
    return this.availableCanvasNames$.asObservable();
  }

  getCanvasWasUpdated(): Observable<Canvas | undefined> {
    return this.canvasWasUpdated$.asObservable();
  }

  getCanvasCustomCellWasUpdated(): Observable<CanvasCustomCell | undefined> {
    return this.canvasCustomCellWasUpdated$.asObservable();
  }

  getCanvasLinkCellWasUpdated(): Observable<CanvasLinkCell | undefined> {
    return this.canvasLinkCellWasUpdated$.asObservable();
  }

  createCanvas( canvasToCreate: Canvas ): Observable<Canvas | undefined> {
    let createCanvasResult: Observable<Canvas | undefined>;
    let canvasToCreateName = canvasToCreate.name;
    let indexOfCanvasToCreate = this.availableCanvasNames$.value.indexOf( canvasToCreateName );
    if (indexOfCanvasToCreate >= 0) {
      console.log( "Not attempting to create Canvas with name [" + canvasToCreateName + "] since it was found to already exist" );
      createCanvasResult = of(undefined);
    } else {
      createCanvasResult = this.createCanvasApiCall(canvasToCreate);
    }
    return createCanvasResult;
  }

  getCanvas(canvasName: string): Observable<Canvas | undefined> {
    let canvasResult: Observable<Canvas | undefined>;
    if (this.isCanvasLoaded(canvasName)) {
      let loadedCanvas = this.loadedCanvases.get(canvasName);
      if (loadedCanvas) {
        canvasResult = of(loadedCanvas);
      } else {
        console.error( "Canvas with name [" + canvasName + "] was null or undefined within the Loaded Canvases Map" );
        canvasResult = of(undefined);
      }
    } else {
      canvasResult = this.getCanvasApiCall(canvasName);
    }
    return canvasResult;
  }

  updateCanvas( canvasToUpdate: Canvas ): Observable<Canvas | undefined> {
    return this.updateCanvasApiCall(canvasToUpdate);
  }

  updateCanvasCustomCell( canvasCustomCellToUpdate: CanvasCustomCell ): Observable<CanvasCustomCell | undefined> {
    return this.updateCanvasCustomCellApiCall(canvasCustomCellToUpdate);
  }

  updateCanvasLinkCell( canvasLinkCellToUpdate: CanvasLinkCell ): Observable<CanvasLinkCell | undefined> {
    return this.updateCanvasLinkCellApiCall(canvasLinkCellToUpdate);
  }

  protected getResourcePathForApiUrl(): string {
    return "/canvas";
  }

  private initCanvases(): void {
    this.getAllCanvasesApiCall().subscribe({
                                    next: (canvases: Canvas[] | undefined) => {
                                      if (!canvases) {
                                        throw new Error("Failed to initialize the Canvases");
                                      }
                                    },
                                    error: (err: any) => {
                                      throw new Error( "Failed to initialize the Canvases due to [" + err + "]" );
                                    },
                                    complete: () => {
                                      console.log("Finished initializing Canvases");
                                    }
                                  });
  }

  private addCanvas(canvas: Canvas): void {
    if (canvas) {
      let canvasName = canvas.name;
      if (
        canvasName !== undefined
        && canvasName !== null
        && canvasName !== ""
      ) {
        this.loadedCanvases.set(canvasName, canvas);
        this.addAvailableCanvasName(canvasName);
      }
    } else {
      console.log( "Null or undefined Canvas was provided to add with the Canvas Service, ignoring" );
    }
  }

  private addAvailableCanvasName(canvasName: string): void {
    if (
      canvasName !== null
      && canvasName !== undefined
      && canvasName !== ""
    ) {
      if (this.availableCanvasNames$.value.indexOf(canvasName) < 0) {
        this.availableCanvasNames$.next([ ...this.availableCanvasNames$.value, canvasName ]);
      }
    }
  }

  private isCanvasLoaded(canvasName: string): boolean {
    return this.loadedCanvases.has(canvasName);
  }

  private unloadAllCanvases(): void {
    this.loadedCanvases.clear();
  }

  private createCanvasApiCall( canvasToCreate: Canvas ): Observable<Canvas | undefined> {
    return this.httpClient.post<Canvas>(this.getApiUrl(), canvasToCreate)
                          .pipe(
                            map((createCanvasResult: Canvas) => {
                              return new Canvas().deserialize(createCanvasResult);
                            }),
                            catchError((error) => {
                              console.log( "Failed to create new Canvas due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((canvas: Canvas | undefined) => {
                              if (canvas) {
                                this.addCanvas(canvas);
                              }
                            })
                          );
  }

  private getCanvasApiCall( canvasName: string ): Observable<Canvas | undefined> {
    return this.httpClient.get<Canvas>(this.getApiUrlWithAddition("/" + canvasName))
                          .pipe(
                            map((getCanvasResult: Canvas) => {
                              return new Canvas().deserialize(getCanvasResult);
                            }),
                            catchError((error) => {
                              console.log( "Failed to get the Canvas with name [" + canvasName + "] due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((canvas: Canvas | undefined) => {
                              if (canvas) {
                                this.addCanvas(canvas);
                              }
                            })
                          );
  }

  private getAllCanvasesApiCall(): Observable<Canvas[] | undefined> {
    return this.httpClient.get<Canvas[]>(this.getApiUrl())
                          .pipe(
                            map((allCanvasesResult: Canvas[]) => {
                              let canvases: Canvas[] = [];
                              allCanvasesResult.forEach((canvasResult: Canvas) => {
                                let canvas = new Canvas().deserialize(canvasResult);
                                canvases.push(canvas);
                              });
                              return canvases;
                            }),
                            catchError((error) => {
                              console.log( "Failed to get all Canvases due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((canvases: Canvas[] | undefined) => {
                              if (canvases) {
                                canvases.forEach((canvas: Canvas) => {
                                  this.addCanvas(canvas);
                                });
                              }
                            })
                          );
  }

  private updateCanvasApiCall( canvasToUpdate: Canvas ): Observable<Canvas | undefined> {
    return this.httpClient.put<Canvas>(this.getApiUrl(), canvasToUpdate)
                          .pipe(
                            map((updateCanvasResult: Canvas) => {
                              return new Canvas().deserialize(updateCanvasResult);
                            }),
                            catchError((error) => {
                              console.log( "Failed to perform update to Canvas due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((canvas: Canvas | undefined) => {
                              if (canvas) {
                                this.addCanvas(canvas);
                                this.canvasWasUpdated$.next(canvas);
                              }
                            })
                          );
  }

  private updateCanvasCustomCellApiCall( canvasCustomCellToUpdate: CanvasCustomCell ): Observable<CanvasCustomCell | undefined> {
    return this.httpClient.put<CanvasCustomCell>(this.getApiUrlWithAddition("/cell/custom"), canvasCustomCellToUpdate)
                          .pipe(
                            map((updateCanvasCustomCellResult: CanvasCustomCell) => {
                              return new CanvasCustomCell().deserialize(updateCanvasCustomCellResult);
                            }),
                            catchError((error) => {
                              console.log( "Failed to perform update to Canvas Custom Cell due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((canvasCustomCell: CanvasCustomCell | undefined) => {
                              if (canvasCustomCell) {
                                this.unloadAllCanvases();
                                this.canvasCustomCellWasUpdated$.next(canvasCustomCell);
                              }
                            })
                          );
  }

  private updateCanvasLinkCellApiCall( canvasLinkCellToUpdate: CanvasLinkCell ): Observable<CanvasLinkCell | undefined> {
    return this.httpClient.put<CanvasLinkCell>(this.getApiUrlWithAddition("/cell/link"), canvasLinkCellToUpdate)
                          .pipe(
                            map((updateCanvasLinkCellResult: CanvasLinkCell) => {
                              return new CanvasLinkCell().deserialize(updateCanvasLinkCellResult);
                            }),
                            catchError((error) => {
                              console.log( "Failed to perform update to Canvas Link Cell due to [" + error + "]", error );
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((canvasLinkCell: CanvasLinkCell | undefined) => {
                              if (canvasLinkCell) {
                                this.unloadAllCanvases();
                                this.canvasLinkCellWasUpdated$.next(canvasLinkCell);
                              }
                            })
                          );
  }

}
