import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, OnInit, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { dia, shapes, elementTools } from "@joint/core";
import { CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV, CANVAS_BOOTSTRAP_COL_CLASS_WITHOUT_NAV, CANVAS_DATABASE_TABLE_DEFAULT_COLUMN_HEIGHT, CANVAS_DATABASE_TABLE_DEFAULT_HEADER_HEIGHT, CANVAS_DATABASE_TABLE_DEFAULT_HEADER_BORDER_HEIGHT, ZERO_OR_MANY_RELATIONSHIP_ERD_ARROWHEAD_ICON_PATH, ONE_OR_MANY_RELATIONSHIP_ERD_ARROWHEAD_ICON_PATH, ONE_AND_ONLY_ONE_RELATIONSHIP_ERD_ARROWHEAD_ICON_PATH } from "../../../../../app.constants";
import { Canvas } from "../../../../../entity/documentation/tool/canvas/canvas";
import { CanvasCell } from "../../../../../entity/documentation/tool/canvas/cell/canvas-cell";
import { CanvasCustomCell } from "../../../../../entity/documentation/tool/canvas/cell/custom/canvas-custom-cell";
import { CanvasCellFactory } from "../../../../../entity/documentation/tool/canvas/cell/factory/canvas-cell-factory";
import { CanvasLinkCell } from "../../../../../entity/documentation/tool/canvas/cell/link/canvas-link-cell";
import { CanvasFactory } from "../../../../../entity/documentation/tool/canvas/factory/canvas-factory";
import { ObjectGrid } from "../../../../../entity/shared/grid/object-grid";
import { JointCellFactory } from "../../../../../entity/shared/joint/cell/factory/joint-cell-factory";
import { SqlDatabaseDetail } from "../../../../../entity/model/database/detail/sql/sql-database-detail";
import { SqlDatabaseDetailPath } from "../../../../../entity/model/database/detail/sql/path/sql-database-path";
import { CanvasService } from "../../../../../service/documentation/tool/canvas/canvas.service";
import { ModalService } from "../../../../../service/shared/modal/modal.service";
import { DatabaseModelDetailService } from "../../../../../service/model/database/detail/db-model-detail.service";
import { BaseComponent } from "../../../../shared/base/base.component";
import { CanvasToolExplorerHeaderComponent } from "./header/canvas-tool-explorer-header.component";
import { SqlColumnDetail } from "../../../../../entity/model/database/detail/sql/column/sql-column-detail";
import { SqlTableDetail } from "../../../../../entity/model/database/detail/sql/table/sql-table-detail";
import { SqlModelDetailService } from "../../../../../service/model/database/detail/sql/sql-model-detail.service";

@Component({
  selector: "canvas-tool-explorer",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    CanvasToolExplorerHeaderComponent
],
  templateUrl: "./canvas-tool-explorer.component.html",
  styleUrl: "./canvas-tool-explorer.component.scss"
})
export class CanvasToolExplorerComponent extends BaseComponent implements OnInit {

  currentJointJsGraph: dia.Graph | undefined;

  currentJointJsPaper: dia.Paper | undefined;

  jointJsGraphs: Map<string, dia.Graph>;

  loadedCanvas: Canvas | undefined;

  availableDatabasePaths: SqlDatabaseDetailPath[];

  availableCanvasNames: string[];

  defaultSidebarOpen: boolean;

  defaultZoomSetting: number;

  maxZoomSetting: number;

  canvasContentClass: string;

  jointJsPaperTransformScale: string | undefined;

  canvasMenuIsClosed: boolean;

  modelMenuIsClosed: boolean;

  collapsibleMenuBaseHtmlId

  menuTitle: string;


  constructor(
    private canvasService: CanvasService,
    private databaseModelComponentService: DatabaseModelDetailService,
    private sqlModelComponentService: SqlModelDetailService,
    private modalService: ModalService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    this.currentJointJsGraph = undefined;
    this.currentJointJsPaper = undefined;
    this.jointJsGraphs = new Map<string, dia.Graph>();
    this.loadedCanvas = undefined;
    this.availableDatabasePaths = [];
    this.availableCanvasNames = [];
    this.defaultSidebarOpen = true;
    this.defaultZoomSetting = 10;
    this.maxZoomSetting = 20;
    this.jointJsPaperTransformScale = undefined;
    this.canvasMenuIsClosed = false;
    this.modelMenuIsClosed = true;
    this.canvasContentClass = CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV;

    this.menuTitle = "canvasMenu";
    this.collapsibleMenuBaseHtmlId =  "_CollapsibleMenu";
  }

  ngOnInit(): void {
    let availableCanvasNamesSubscription = this.canvasService.getAvailableCanvasNames().subscribe({
                                                                                            next: (canvasNames: string[] | undefined) => {
                                                                                              if (!canvasNames) {
                                                                                                throw new Error("Failed to load the available Canvas Names");
                                                                                              }
                                                                                              this.availableCanvasNames = canvasNames;
                                                                                            },
                                                                                            error: (err: any) => {
                                                                                              throw new Error( "Failed to load the available Canvas Names due to [" + err + "]" );
                                                                                            },
                                                                                            complete: () => {
                                                                                              console.log("Finished loading the available Canvas Names");
                                                                                            }
                                                                                          });
    this.addLongLivingSubscription(availableCanvasNamesSubscription);

    let availableDatabasePathsSubscription = this.sqlModelComponentService.getAvailableDatabaseDetailPaths().subscribe({
                                                                                                          next: (databasePaths: SqlDatabaseDetailPath[] | undefined) => {
                                                                                                            if (!databasePaths) {
                                                                                                              throw new Error( "Failed to load the available Database Paths" );
                                                                                                            }
                                                                                                            this.availableDatabasePaths = databasePaths;
                                                                                                          },
                                                                                                          error: (err: any) => {
                                                                                                            throw new Error( "Failed to load the available Database Paths due to [" + err + "]" );
                                                                                                          },
                                                                                                          complete: () => {
                                                                                                            console.log("Finished loading the available Database Paths");
                                                                                                          }
                                                                                                        });
    this.addLongLivingSubscription(availableDatabasePathsSubscription);

    let canvasWasUpdatedSubscription = this.canvasService.getCanvasWasUpdated().subscribe({
                                                                                    next: (updatedCanvas: Canvas | undefined) => {
                                                                                      if (updatedCanvas) {
                                                                                        this.unloadCanvas();
                                                                                      }
                                                                                    },
                                                                                    error: (err: any) => {
                                                                                      throw new Error( "Errored out listening to Canvas updates due to [" + err + "]" );
                                                                                    },
                                                                                    complete: () => {
                                                                                      console.log("Finished loading updated Canvas");
                                                                                    }
                                                                                  });
    this.addLongLivingSubscription(canvasWasUpdatedSubscription);

    let canvasCustomCellWasUpdatedSubscription = this.canvasService.getCustomCellWasUpdated().subscribe({
                                                                                                  next: (updatedCanvasCustomCell: CanvasCustomCell | undefined) => {
                                                                                                    if (updatedCanvasCustomCell) {
                                                                                                      this.unloadCanvas();
                                                                                                    }
                                                                                                  },
                                                                                                  error: (err: any) => {
                                                                                                    throw new Error( "Errored out listening to Canvas Custom Cell updates due to [" + err + "]" );
                                                                                                  },
                                                                                                  complete: () => {
                                                                                                    console.log("Finished loading updated Canvas Custom Cell");
                                                                                                  }
                                                                                                });
    this.addLongLivingSubscription(canvasCustomCellWasUpdatedSubscription);

    let canvasLinkCellWasUpdatedSubscription = this.canvasService.getLinkCellWasUpdated().subscribe({
                                                                                                next: (updatedCanvasLinkCell: CanvasLinkCell | undefined) => {
                                                                                                  if (updatedCanvasLinkCell) {
                                                                                                    this.unloadCanvas();
                                                                                                  }
                                                                                                },
                                                                                                error: (err: any) => {
                                                                                                  throw new Error( "Errored out listening to Canvas Link Cell updates due to [" + err + "]" );
                                                                                                },
                                                                                                complete: () => {
                                                                                                  console.log("Finished loading updated Canvas Link Cell");
                                                                                                }
                                                                                              });
    this.addLongLivingSubscription(canvasLinkCellWasUpdatedSubscription);

    this.updateCanvasZoom(this.defaultZoomSetting);
  }

  canvasMenuToggleClicked(): void {
    if (this.canvasMenuIsClosed) {
      this.canvasMenuIsClosed = false;

      this.modelMenuIsClosed = true;
    } else {
      this.canvasMenuIsClosed = true;
    }
  }

  modelMenuToggleClicked(): void {
    if (this.modelMenuIsClosed) {
      this.modelMenuIsClosed = false;

      this.canvasMenuIsClosed = true;
    } else {
      this.modelMenuIsClosed = true;
    }
  }

  getCanvasTitle(): string {
    let canvasTitle = "";
    if (this.loadedCanvas) {
      canvasTitle = this.loadedCanvas.name;
    }
    return canvasTitle;
  }

  updateCanvasZoom(updatedZoomValue: number): void {
    let zoomScale = Number(updatedZoomValue) / 10;
    this.jointJsPaperTransformScale = this.createPaperTransformScale(zoomScale);
  }

  onToggleCanvasSidebar(): void {
    if (this.canvasContentClass === CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV) {
      this.canvasContentClass = CANVAS_BOOTSTRAP_COL_CLASS_WITHOUT_NAV;

      let mainContentSize = "flex: 0 0 auto; width:2.58333%;";
      let sidebarMenuSize = "flex: 0 0 auto; width:97.416666%;";
    } else {
      this.canvasContentClass = CANVAS_BOOTSTRAP_COL_CLASS_WITH_NAV;
    }
  }

  loadSelectedCanvas(selectedCanvasName: string): void {
    this.canvasService.getCanvas(selectedCanvasName).subscribe({
                                                          next: (selectedCanvas: Canvas | undefined) => {
                                                            if (!selectedCanvas) {
                                                              throw new Error( "Failed to load the Canvas using name [" + selectedCanvasName + "]" );
                                                            }
                                                            this.currentJointJsGraph = new dia.Graph({}, { cellNamespace: shapes });
                                                            this.currentJointJsPaper = this.createNewPaperForGraph(
                                                              this.currentJointJsGraph,
                                                              selectedCanvas.height,
                                                              selectedCanvas.width,
                                                              selectedCanvas.backgroundColor
                                                            );

                                                            let canvasCells = selectedCanvas.cells;
                                                            this.createAndAddJointCellsFromCanvasCells(canvasCells);

                                                            this.currentJointJsPaper.unfreeze();
                                                            this.loadedCanvas = selectedCanvas;

                                                            Canvas.initializeJointCanvasValues(
                                                              selectedCanvas.id,
                                                              selectedCanvas.name,
                                                              this.currentJointJsGraph
                                                            );
                                                          },
                                                          error: (err: any) => {
                                                            throw new Error( "Failed to load the Canvas using name [" + selectedCanvasName + "] due to [" + err + "]" );
                                                          },
                                                          complete: () => {
                                                            console.log("Finished loading the Canvas");
                                                          }
                                                        });
  }

  unloadCanvas(): void {
    // if(this.currentJointJsGraph) {
    //   this.currentJointJsGraph.clear();
    // }

    // if(this.currentJointJsPaper) {
    //   this.currentJointJsPaper.remove();
    // }

    // this.currentJointJsGraph = undefined;
    // this.currentJointJsPaper = undefined;

    this.loadedCanvas = undefined;
    this.currentJointJsGraph = new dia.Graph({}, { cellNamespace: shapes });
    this.currentJointJsPaper = this.createNewPaperForGraph(
      this.currentJointJsGraph,
      0,
      0,
      "#FFFFFF"
    );
  }

  saveAllChanges(): void {
    if (
      this.loadedCanvas
      && this.currentJointJsGraph
      && this.currentJointJsPaper
    ) {
      let updatedCanvas = CanvasFactory.createCanvasFromJointJsGraph(
        this.currentJointJsGraph,
        this.currentJointJsPaper
      );

      this.canvasService.updateCanvas(updatedCanvas).subscribe({
                                                          next: (updatedCanvas: Canvas | undefined) => {
                                                            if (!updatedCanvas) {
                                                              throw new Error("Failed to update the Canvas");
                                                            }
                                                          },
                                                          error: (err: any) => {
                                                            throw new Error( "Failed to update the Canvas due to [" + err + "]" );
                                                          },
                                                          complete: () => {
                                                            console.log("Finished updating the Canvas");
                                                          }
                                                        });
    }
  }

  addCellsFromDatabase(databasePath: SqlDatabaseDetailPath): void {
    if (this.currentJointJsGraph) {
      this.sqlModelComponentService.getDatabaseDetail(databasePath).subscribe({
                                                                      next: (database: SqlDatabaseDetail | undefined) => {
                                                                        if (!database) {
                                                                          throw new Error( "Failed to get the Database Component using Name [" + databasePath.getFullPath() + "]" );
                                                                        }
                                                                        if (!this.loadedCanvas) {
                                                                          throw new Error( "Attempting to add Cells from the Database Component, but the Canvas was not found" );
                                                                        }
                                                                        let nonNullLoadedCanvas: Canvas = this.loadedCanvas;
                                                                        let createdCanvasCells: CanvasCell[] = [];
                                                                        let tablesPerCanvasRow: number = 4;
                                                                        let tableLayoutGrid: ObjectGrid<SqlTableDetail> = CanvasCellFactory.createGridLayoutForTables( database, tablesPerCanvasRow );
                                                                        let canvasCellsByTableModel = CanvasCellFactory.createCanvasCustomCellsFromTableGrid( tableLayoutGrid, nonNullLoadedCanvas, database );

                                                                        canvasCellsByTableModel.forEach((canvasCell: CanvasCell, tableModel: SqlTableDetail) => {
                                                                            createdCanvasCells.push(canvasCell);

                                                                            let canvasLinkCells =CanvasCellFactory.createLinkCellsForDatabaseTable(
                                                                                                                          nonNullLoadedCanvas,
                                                                                                                          database,
                                                                                                                          tableModel,
                                                                                                                          CANVAS_DATABASE_TABLE_DEFAULT_COLUMN_HEIGHT,
                                                                                                                          CANVAS_DATABASE_TABLE_DEFAULT_HEADER_HEIGHT,
                                                                                                                          CANVAS_DATABASE_TABLE_DEFAULT_HEADER_BORDER_HEIGHT,
                                                                                                                          canvasCellsByTableModel
                                                                                                                        );
                                                                            canvasLinkCells.forEach((canvasLinkCell: CanvasLinkCell) =>
                                                                              createdCanvasCells.push(canvasLinkCell)
                                                                            );
                                                                          });

                                                                        createdCanvasCells.forEach((createdCanvasCell: CanvasCell) => {
                                                                          createdCanvasCell.canvasId = nonNullLoadedCanvas.id;
                                                                          nonNullLoadedCanvas.cells.push(createdCanvasCell);
                                                                        });

                                                                        this.createAndAddJointCellsFromCanvasCells(createdCanvasCells);
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error( "Failed to get the Database Model using Name [" + databasePath.getFullPath() + "] due to [" + err + "]" );
                                                                      },
                                                                      complete: () => {
                                                                        console.log("Finished getting the Database Model");
                                                                      }
                                                                    });
    }
  }

  getAvailableCanvasNames(): string[] {
    return this.availableCanvasNames.sort();
  }

  undoAllChanges(): void {
    if (
      this.loadedCanvas
      && this.currentJointJsGraph
      && this.currentJointJsPaper
    ) {
      this.currentJointJsGraph.getCells().forEach((currentCell: dia.Cell) => {
        let initialCellId = CanvasLinkCell.getInitialJointCellId(currentCell);
        let initialCellName = CanvasLinkCell.getInitialJointCellGlobalName(currentCell);
        let initialCellLocalName = CanvasLinkCell.getInitialJointCellLocalName(currentCell);
        if (currentCell instanceof shapes.standard.Link) {
          let initialSourceCellName = CanvasLinkCell.getInitialJointSourceCellName(currentCell);
          let initialSourceCellDx = CanvasLinkCell.getInitialJointSourceCellDx(currentCell);
          let initialSourceCellDy = CanvasLinkCell.getInitialJointSourceCellDy(currentCell);

          let initialTargetCellName = CanvasLinkCell.getInitialJointTargetCellName(currentCell);
          let initialTargetCellDx = CanvasLinkCell.getInitialJointTargetCellDx(currentCell);
          let initialTargetCellDy = CanvasLinkCell.getInitialJointTargetCellDy(currentCell);
        } else {
          let initialCellHtml = CanvasCustomCell.getInitialJointCellHtml(currentCell);
          let initialCellLinks = CanvasCustomCell.getInitialJointCellLinks(currentCell);
          let initialLinkedCells = CanvasCustomCell.getInitialJointLinkedCells(currentCell);
          let initialRelativePositionToOtherCells = CanvasCustomCell.getInitialJointRelativePositionToOtherCells( currentCell );
        }
      });
    }
  }

  toggleLinkVisibility(link: shapes.standard.Link): void {
    let currentDisplayForLink = CanvasCellFactory.getCurrentDisplayValueForLink(link);
    if (CanvasCellFactory.isDisplayVisible(currentDisplayForLink)) {
      link.attr("./display", "none");
    } else {
      link.attr("./display", "");
    }
  }

  handleClickedCell( cellView: dia.CellView, evt: dia.Event, x: number, y: number ): void {
    let clickedElementId = evt.target.getAttribute("id");
    console.log("Element [" + clickedElementId + "] was clicked");

    let htmlIdComponentDelimiter = "__";

    let startIndexOfCanvasComponent = clickedElementId.indexOf("Canvas");
    if (startIndexOfCanvasComponent >= 0) {
      let endIndexOfCanvasComponent = clickedElementId.indexOf(
        htmlIdComponentDelimiter,
        startIndexOfCanvasComponent
      );
      if (endIndexOfCanvasComponent < 0) {
        throw new Error( "The Ending Index of the Canvas ID Component was not found using delimiter [" + htmlIdComponentDelimiter + "]; HTML ID [" + clickedElementId + "]" );
      }
      let canvasComponentId = clickedElementId.slice(
        startIndexOfCanvasComponent,
        endIndexOfCanvasComponent
      );
      let customCellIdTag = "CustomCell";
      let indexOfCustomCellId = canvasComponentId.indexOf(customCellIdTag);
      if (indexOfCustomCellId > 0) {
        this.handleClickedCustomCell(clickedElementId, cellView, evt);
      }
    } else {
      // Error
    }
  }

  private handleClickedCustomCell( clickedElementId: string, cellView: dia.CellView, evt: dia.Event ) {
    let startIndexOfDatabaseComponent = clickedElementId.indexOf("DbModel");
    if (startIndexOfDatabaseComponent >= 0) {
      this.handleClickedDatabaseCell(clickedElementId, cellView, evt);
    }
  }

  private handleClickedDatabaseCell( clickedElementId: string, cellView: dia.CellView, evt: dia.Event ) {
    let startIndexOfHtmlTableIdComponent = clickedElementId.indexOf("HtmlTable");
    if (startIndexOfHtmlTableIdComponent < 0) {
      throw new Error( "Unable to find the HTML Table ID Component for the Clicked Database Model Cell; HTML ID [" + clickedElementId + "]" );
    }

    // Check if the clicked Element is a Table Header by inspecting the ID
    let indexOfHtmlTableHeaderTag = clickedElementId.indexOf("__HtmlTable_Header");
    if (indexOfHtmlTableHeaderTag >= 0) {
      // If the Clicked Element is a Table Header, then toggle the hiding of the Table Body
      let htmlTableBodyId = clickedElementId.slice( 0, indexOfHtmlTableHeaderTag );
      htmlTableBodyId = htmlTableBodyId + "__HtmlTable_Body";
      let clickedElementHtmlTableBody =
        this.document.getElementById(htmlTableBodyId);
      if (!clickedElementHtmlTableBody) {
        // ERROR
        throw new Error( "Unable to find the Body of the Table for the clicked HTML Element with ID [" + clickedElementId + "]" );
      }
      let currentDisplayValue = clickedElementHtmlTableBody.style.display;
      if (currentDisplayValue === "none") {
        clickedElementHtmlTableBody.style.display = "";
      } else {
        clickedElementHtmlTableBody.style.display = "none";
      }

      let clickedCellName = this.extractCustomCellNameFromHtmlId(clickedElementId);
      if (clickedCellName === "") {
        throw new Error( "Failed to extract the Cell Name within the Custom Cell Tag [" + clickedElementId + "]" );
      }
      if (this.currentJointJsGraph == undefined) {
        throw new Error( "Attempting to handle a clicked Database Cell, but can not find the underlying JointJS Graph" );
      }
      let links = this.currentJointJsGraph.getLinks();
      links.forEach((link: shapes.standard.Link) => {
        let sourceCellName = CanvasLinkCell.getCurrentJointSourceCellName(link);
        let targetCellName = CanvasLinkCell.getCurrentJointTargetCellName(link);

        // If the clicked Cell is a source or target for any Links, then we need to hide it
        if (
          sourceCellName === clickedCellName
          || targetCellName === clickedCellName
        ) {
          this.toggleLinkVisibility(link);
        }
      });
    }

    let indexOfTableDataRowTag = clickedElementId.indexOf("TableDataRow");
    if (indexOfTableDataRowTag >= 0) {
      let indexOfTableColumnNameStart = clickedElementId.indexOf( ".", indexOfTableDataRowTag );
      if (indexOfTableColumnNameStart >= 0) {
        indexOfTableColumnNameStart = indexOfTableColumnNameStart + 1;
        let indexOfTableColumnNameEnd = clickedElementId.indexOf( "_TableData", indexOfTableColumnNameStart );
        if (indexOfTableColumnNameEnd < 0) {
          indexOfTableColumnNameEnd = clickedElementId.length;
        }

        let startIndexOfDatabase = clickedElementId.indexOf("DbModel");
        let startIndexOfDatabasePath = clickedElementId.indexOf( ".", startIndexOfDatabase );
        let endIndexOfDatabasePath = clickedElementId.indexOf( "_", startIndexOfDatabasePath );
        let fullDatabasePath = clickedElementId.slice(
          startIndexOfDatabasePath + 1,
          endIndexOfDatabasePath
        );
        let endIndexOfDatbaseName = fullDatabasePath.indexOf(".");
        let databaseName = fullDatabasePath.slice(0, endIndexOfDatbaseName);
        let schemaName = fullDatabasePath.slice(endIndexOfDatbaseName + 1);
        let databasePath = new SqlDatabaseDetailPath();
        databasePath.databaseName = databaseName;
        databasePath.schemaName = schemaName;

        let startIndexOfTable = clickedElementId.indexOf("TableModel");
        let startIndexOfTableName = clickedElementId.indexOf( ".", startIndexOfTable );
        let endIndexOfTableName = clickedElementId.indexOf( "__", startIndexOfTableName );
        let tableName = clickedElementId.slice(
          startIndexOfTableName + 1,
          endIndexOfTableName
        );

        let columnName = clickedElementId.slice( indexOfTableColumnNameStart, indexOfTableColumnNameEnd );

        this.sqlModelComponentService.getDatabaseDetail(databasePath).subscribe({
                                                                  next: (database: SqlDatabaseDetail | undefined) => {
                                                                    if (!database) {
                                                                      throw new Error("Failed to get the SQL Database Detail using Path [" + databasePath.getFullPath() + "]");
                                                                    }
                                                                    let tableFound = database.tables.find((table: SqlTableDetail) => {
                                                                      table.name === tableName
                                                                    });
                                                                    if (tableFound) {
                                                                      let columnFound = tableFound.columns.find((column: SqlColumnDetail) => {
                                                                        column.name === columnName
                                                                      });
                                                                      if (columnFound) {
                                                                        let targetElementBoundingRect = evt.target.getBoundingClientRect();
                                                                        let modalBodyPositionX = targetElementBoundingRect.x + targetElementBoundingRect.width;
                                                                        let modalBodyPositionY = targetElementBoundingRect.y;

                                                                        this.modalService.open("columnUpdateModal");
                                                                      }
                                                                    }
                                                                  },
                                                                  error: (err: any) => {
                                                                    throw new Error("Failed to get the SQL Database Detail using Path [" + databasePath.getFullPath() + "] due to [" + err + "]");
                                                                  },
                                                                  complete: () => {
                                                                    console.log("Finished getting the SQL Database Detail");
                                                                  }
                                                                });
      }
    }
  }

  private extractCustomCellNameFromHtmlId(clickedElementId: string): string {
    let indexOfCustomCellTagStart = clickedElementId.indexOf("_CustomCell");
    let indexOfCustomCellTagEnd = clickedElementId.indexOf(
      "_",
      indexOfCustomCellTagStart + 1
    );
    if (
      indexOfCustomCellTagStart < 0
      || indexOfCustomCellTagStart === clickedElementId.length - 1
    ) {
      throw new Error( "Failed to find the index of the start of the Custom Cell Tag within the ID [" + clickedElementId + "]" );
    } else if (
      indexOfCustomCellTagEnd < 0
      || indexOfCustomCellTagStart === clickedElementId.length - 1
    ) {
      throw new Error( "Failed to find the index of the end of the Custom Cell Tag within the ID [" + clickedElementId + "]" );
    }
    let clickedCustomCellTag = clickedElementId.slice(
      indexOfCustomCellTagStart + 1,
      indexOfCustomCellTagEnd
    );
    let customCellTagNameDivider = ".";
    let indexOfCustomCellTagNameDivider = clickedCustomCellTag.indexOf(
      customCellTagNameDivider
    );
    if (
      indexOfCustomCellTagNameDivider < 0
      || indexOfCustomCellTagNameDivider === clickedCustomCellTag.length - 1
    ) {
      throw new Error( "Failed to find the index of the Name Divider [" + customCellTagNameDivider + "] within the Custom Cell Tag [" + clickedElementId + "]" );
    }
    return clickedCustomCellTag.slice(indexOfCustomCellTagNameDivider + 1);
  }

  private createNewPaperForGraph( jointJsGraph: dia.Graph, height: number, width: number, backgroundColor: string ): dia.Paper {
    let newPaperForGraph = new dia.Paper({
      el: this.document.getElementById( "canvasToolExplorer_JointJsPaper" ),
      model: jointJsGraph,
      height: height,
      width: width,
      background: {
        color: backgroundColor,
      },
      sorting: dia.Paper.sorting.APPROX,
      cellViewNamespace: shapes,
      gridSize: 10,
      drawGrid: true,
      restrictTranslate: true
    });

    newPaperForGraph.defineMarker({
      id: "erd.arrowhead.zero-or-many-releationship",
      markup:
      `
        <image y="-11" href="${ZERO_OR_MANY_RELATIONSHIP_ERD_ARROWHEAD_ICON_PATH}"/>
      `
    });
    newPaperForGraph.defineMarker({
      id: "erd.arrowhead.one-or-many-releationship",
      markup:
      `
        <image y="-11" href="${ONE_OR_MANY_RELATIONSHIP_ERD_ARROWHEAD_ICON_PATH}" />
      `
    });
    newPaperForGraph.defineMarker({
      id: "erd.arrowhead.one-and-only-one-releationship",
      markup:
      `
        <image y="-8" href="${ONE_AND_ONLY_ONE_RELATIONSHIP_ERD_ARROWHEAD_ICON_PATH}" />
      `
    });

    newPaperForGraph.on("cell:pointerclick", (cellView, evt, x, y) => {
      this.handleClickedCell(cellView, evt, x, y);
    });

    newPaperForGraph.on("element:mouseenter", (elementView) => {
      elementView.showTools();
    });

    newPaperForGraph.on("element:mouseleave", (elementView) => {
      elementView.hideTools();
    });

    return newPaperForGraph;
  }

  private createAndAddJointCellsFromCanvasCells(canvasCells: CanvasCell[]): void {
    // First, split the Cells into two categories, Custom Cells and Link Cells; this allows us to create all the Custom Cells first since the Link Cells refer to them
    let canvasCustomCells: CanvasCustomCell[] = [];
    let canvasLinkCells: CanvasLinkCell[] = [];
    canvasCells.forEach((canvasCell: CanvasCell) => {
      if (canvasCell instanceof CanvasCustomCell) {
        canvasCustomCells.push(canvasCell);
      } else if (canvasCell instanceof CanvasLinkCell) {
        canvasLinkCells.push(canvasCell);
      } else {
        throw new Error( "Unrecognized Canvas Cell type [" + typeof canvasCell + "]" );
      }
    });

    this.createAndAddCustomCellsFromCanvas(canvasCustomCells);
    this.createAndAddLinksFromCanvas(canvasLinkCells);
  }

  private createAndAddCustomCellsFromCanvas( canvasCustomCells: CanvasCustomCell[] ): void {
    if (!this.currentJointJsPaper) {
      throw new Error( "Attempted to create and add Custom Cells, but the underlying JointJS Paper could not be found" );
    } else if (!this.currentJointJsGraph) {
      throw new Error( "Attempted to create and add Custom Cells, but the underlying JointJS Graph could not be found" );
    }
    let nonNullCurrentJointJsPaper: dia.Paper = this.currentJointJsPaper;
    let nonNullCurrentJointJsGraph: dia.Graph = this.currentJointJsGraph;

    canvasCustomCells.forEach((canvasCustomCell: CanvasCustomCell) => {
      let cellToAddToCanvas = JointCellFactory.createJointCustomCellForCanvasCustomCell( nonNullCurrentJointJsGraph, canvasCustomCell );
      cellToAddToCanvas.addTo(nonNullCurrentJointJsGraph);

      const removeButton = new elementTools.Remove();
      const toolsView = new dia.ToolsView({
        tools: [removeButton],
      });

      let elementView = cellToAddToCanvas.findView(nonNullCurrentJointJsPaper);
      elementView.addTools(toolsView);
      nonNullCurrentJointJsPaper.hideTools();
    });
  }

  private createAndAddLinksFromCanvas( canvasLinkCells: CanvasLinkCell[] ): void {
    if (!this.currentJointJsGraph) {
      throw new Error( "Attempted to create and add Link Cells, but the underlying JointJS Graph could not be found" );
    }
    let nonNullCurrentJointJsGraph: dia.Graph = this.currentJointJsGraph;

    canvasLinkCells.forEach((canvasLinkCell: CanvasLinkCell) => {
      let cellToAddToCanvas = JointCellFactory.createJointLinkFromCanvasLink(
        nonNullCurrentJointJsGraph,
        canvasLinkCell
      );
      cellToAddToCanvas.addTo(nonNullCurrentJointJsGraph);
      cellToAddToCanvas.toBack();
    });
  }

  private createPaperTransformScale(canvasZoomScale: number): string {
    return "scale(" + canvasZoomScale + ")";
  }

}
