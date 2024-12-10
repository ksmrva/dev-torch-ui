import { dia, shapes } from "@joint/core";
import { PRIMARY_KEY_ICON_PATH, FOREIGN_KEY_ICON_PATH, CANVAS_DATABASE_TABLE_DEFAULT_HEADER_HEIGHT, CANVAS_DATABASE_TABLE_DEFAULT_HEADER_BORDER_HEIGHT, CANVAS_DATABASE_TABLE_DEFAULT_COLUMN_HEIGHT } from "../../../../../../app.constants";
import { ObjectGrid } from "../../../../../misc/grid/object-grid";
import { StringUtil } from "../../../../../misc/string/util/string-util";
import { DbColumnModel } from "../../../../../model/database/component/column/db-column-model";
import { DbForeignKeyModel } from "../../../../../model/database/component/constraint/key/foreign/db-foreign-key-model";
import { DbPrimaryKeyColumnModel } from "../../../../../model/database/component/constraint/key/primary/column/db-primary-key-column-model";
import { DbPrimaryKeyModel } from "../../../../../model/database/component/constraint/key/primary/db-primary-key-model";
import { DbModel } from "../../../../../model/database/component/db-model";
import { DbTableModel } from "../../../../../model/database/component/table/db-table-model";
import { Canvas } from "../../canvas";
import { CanvasCell } from "../canvas-cell";
import { CanvasCustomCell } from "../custom/canvas-custom-cell";
import { CanvasLinkCell } from "../link/canvas-link-cell";
import { CanvasCellLinkCount } from "../link/count/canvas-cell-link-count";

export const HTML_ID_COMPONENT_DELIMITER: string = "__";

export class CanvasCellFactory {

  static deserialize(json: any): CanvasCell | undefined {
    let canvasCellToReturn: CanvasCell | undefined;
    if (json) {
      let canvasCellType = json["@type"];
      if (canvasCellType) {
        let canvasCell: CanvasCell | undefined;
        if (canvasCellType === "custom") {
          canvasCell = new CanvasCustomCell().deserialize(json);
          canvasCellToReturn = canvasCell;
        } else if (canvasCellType === "link") {
          canvasCell = new CanvasLinkCell().deserialize(json);
          canvasCellToReturn = canvasCell;
        } else {
          console.warn("Unrecognized Canvas Cell Type [" + canvasCellType + "]; unable to deserialize JSON [" + json + "]");
        }
      }
    }
    return canvasCellToReturn;
  }

  static createCanvasLinkCellFromJointCell(jointLink: dia.Cell, canvasId: number): CanvasLinkCell {
    let id = CanvasCell.getCurrentJointCellId(jointLink);
    let cellName = CanvasCell.getCurrentJointCellName(jointLink);
    let cellLocalName = CanvasCell.getCurrentJointCellLocalName(jointLink);

    let sourceCellName = CanvasLinkCell.getCurrentJointSourceCellName(jointLink);
    let targetCellName = CanvasLinkCell.getCurrentJointTargetCellName(jointLink);

    let linkSourceDx = CanvasLinkCell.getCurrentJointSourceCellDx(jointLink);
    let linkSourceDy = CanvasLinkCell.getCurrentJointSourceCellDy(jointLink);

    let linkTargetDx = CanvasLinkCell.getCurrentJointTargetCellDx(jointLink);
    let linkTargetDy = CanvasLinkCell.getCurrentJointTargetCellDy(jointLink);

    return new CanvasLinkCell().initialize(
      id,
      canvasId,
      cellName,
      cellLocalName,
      sourceCellName,
      targetCellName,
      linkSourceDx,
      linkSourceDy,
      linkTargetDx,
      linkTargetDy
    );
  }

  static createCanvasCustomCellFromJointCell(jointCell: dia.Cell, canvasId: number): CanvasCustomCell {
    let id = CanvasCell.getCurrentJointCellId(jointCell);
    let cellName = CanvasCell.getCurrentJointCellName(jointCell);
    let cellLocalName = CanvasCell.getCurrentJointCellLocalName(jointCell);
    let cellHtml = CanvasCustomCell.getCurrentJointCellHtml(jointCell);

    let jointCellAttrributes = jointCell.attributes["attrs"];
    if (jointCellAttrributes) {
      let foreignObjectAttrributes = jointCellAttrributes["foreignObject"];
      if (foreignObjectAttrributes) {
        let cellHeight = foreignObjectAttrributes["height"];
        if (cellHeight == null || cellHeight == undefined) {
          throw new Error("Height was null/undefined from the Joint Cell attributes");
        }
        let cellWidth = foreignObjectAttrributes["width"];
        if (cellWidth == null || cellWidth == undefined) {
          throw new Error("Width was null/undefined from the Joint Cell attributes");
        }
        let canvasPositionX = jointCell.position().x;
        let canvasPositionY = jointCell.position().y;

        return new CanvasCustomCell().initialize(
          id,
          canvasId,
          cellName,
          cellLocalName,
          cellHtml,
          cellHeight,
          cellWidth,
          canvasPositionX,
          canvasPositionY
        );
      } else {
        throw new Error("Foreign Object Attributes were null/undefined");
      }
    } else {
      throw new Error("Joint Cell Attributes were null/undefined");
    }
  }

  static createLinkCellsForDatabaseTable(canvas: Canvas, dbModel: DbModel, tableModel: DbTableModel, columnHeight: number, headerHeight: number, headerBorderHeight: number, canvasCellsByTableModel: Map<DbTableModel, CanvasCell>): CanvasLinkCell[] {
    let canvasLinkCells: CanvasLinkCell[] = [];

    let foreignKeyModels = tableModel.foreignKeys ? tableModel.foreignKeys : [];

    foreignKeyModels.forEach((foreignKeyModel: DbForeignKeyModel) => {
      let foreignKeyLink = CanvasCellFactory.createCanvasLinkCellForForeignKey(
                                                                                canvas,
                                                                                foreignKeyModel,
                                                                                dbModel,
                                                                                tableModel,
                                                                                columnHeight,
                                                                                headerHeight,
                                                                                headerBorderHeight,
                                                                                canvasCellsByTableModel
                                                                              );
      canvasLinkCells.push(foreignKeyLink);
    });

    return canvasLinkCells;
  }

  static createCanvasLinkCellForForeignKey(canvas: Canvas, foreignKeyModel: DbForeignKeyModel, dbModel: DbModel, localTableModel: DbTableModel, columnHeight: number, headerHeight: number, headerBorderHeight: number, canvasCellsByTableModel: Map<DbTableModel, CanvasCell>): CanvasLinkCell {
    let referencedTableModelId = foreignKeyModel.referencedTableId;
    let referencedColumnModelId = foreignKeyModel.referencedColumnId;
    let localColumnModelId = foreignKeyModel.localColumnId;

    let localTableColumnModels = localTableModel.columns;

    let localColumnModel = <DbColumnModel>(localTableColumnModels.find((columnModel: DbColumnModel) => {
      return columnModel.id === localColumnModelId;
    }));
    if (!localColumnModel) {
      throw new Error("Failed to find the Foreign Object's Local Column Model using id [" + localColumnModelId + "] from table model with name [" + localTableModel.name + "]");
    }

    // TODO: Make this more dynamic where it investigates the Cells HTML for the true position of the column
    let localColumnModelIndex = localColumnModel.columnIndex;
    let linkSourceDy = headerHeight + headerBorderHeight + columnHeight * (localColumnModelIndex - 1) + columnHeight / 2;
    let linkSourceDx = 0;

    let referencedTableModel = dbModel.tables.find((tableModel: DbTableModel) => {
      return tableModel.id === referencedTableModelId;
    });
    if (!referencedTableModel) {
      throw new Error("Failed to find the Foreign Object Target's table model using Id [" + referencedTableModelId + "]");
    }
    let referencedColumnModel = <DbColumnModel>(referencedTableModel.columns.find((columnModel: DbColumnModel) => {
      return columnModel.id === referencedColumnModelId;
    }));
    if (!referencedColumnModel) {
      throw new Error("Failed to find the Foreign Object Target's column model using id [" + referencedColumnModelId + "] from table model with name [" + referencedTableModel.name + "]");
    }

    // TODO: Make this more dynamic where it investigates the Cells HTML for the true position of the column
    let referencedColumnModelIndex = referencedColumnModel.columnIndex;

    // DY is equal to the height of the Header Row w/Border + the height of all the Columns above it in the table + half the height of a Column (to place it in the middle of the table row)
    let linkTargetDy =
      headerHeight +
      headerBorderHeight +
      columnHeight * (referencedColumnModelIndex - 1) +
      columnHeight / 2;
    let linkTargetDx = 0;

    let linkCellNameInit = CanvasCellFactory.getUniqueComponentForCellName();
    let linkCellLocalNameInit = CanvasCellFactory.createDatabaseTableForeignKeyLocalName(
                                                      dbModel,
                                                      localTableModel,
                                                      localColumnModel,
                                                      referencedTableModel,
                                                      referencedColumnModel
                                                    );

    let localTableCanvasCell = canvasCellsByTableModel.get(localTableModel);
    if (!localTableCanvasCell) {
      throw new Error("Failed to find the Local Table's Canvas Cell; Local Table [" + localTableModel.name + "]");
    }
    let referencedTableCanvasCell = canvasCellsByTableModel.get(referencedTableModel);
    if (!referencedTableCanvasCell) {
      throw new Error("Failed to find the Referenced Table's Canvas Cell; Referenced Table [" + referencedTableModel.name + "]");
    }

    let sourceCellNameInit = localTableCanvasCell.localName;
    let referencedTableCustomCellName = referencedTableCanvasCell.localName;

    return new CanvasLinkCell().initialize(
      -1,
      canvas.id,
      linkCellNameInit,
      linkCellLocalNameInit,
      sourceCellNameInit,
      referencedTableCustomCellName,
      linkSourceDx,
      linkSourceDy,
      linkTargetDx,
      linkTargetDy
    );
  }

  static createCanvasCustomCellsFromTableGrid(tableLayoutGrid: ObjectGrid<DbTableModel>, canvas: Canvas, dbModel: DbModel): Map<DbTableModel, CanvasCell> {
    let canvasCellsByTableModel: Map<DbTableModel, CanvasCell> = new Map<DbTableModel, CanvasCell>();
    let previousTableEndPositionX = 0;
    let currentLayoutRowIndex = 0;
    let currentRowLargestY = 0;
    let createdCustomCellsGrid: ObjectGrid<CanvasCustomCell> = new ObjectGrid<CanvasCustomCell>(tableLayoutGrid.objectsPerRow);
    tableLayoutGrid.grid.forEach((tableLayoutRow: (DbTableModel | null)[]) => {
      let currentLayoutColumnIndex = 0;

      let previousRowLargestY = 0;
      if (currentLayoutRowIndex > 0) {
        previousRowLargestY = currentRowLargestY;
      }
      currentRowLargestY = 0;

      tableLayoutRow.forEach((tableModel: DbTableModel | null) => {
        if (tableModel === null) {
          // Add null to mirror the TableModel grid
          createdCustomCellsGrid.add(null);
        } else {
          let customCellToTheLeft: CanvasCustomCell | null;
          if (currentLayoutColumnIndex > 0) {
            let customCellToTheLeftRowIndex = currentLayoutRowIndex;
            let customCellToTheLeftColumnIndex = currentLayoutColumnIndex - 1;

            customCellToTheLeft = createdCustomCellsGrid.grid[customCellToTheLeftRowIndex][customCellToTheLeftColumnIndex];
          } else {
            customCellToTheLeft = null;
          }

          if (customCellToTheLeft) {
            previousTableEndPositionX =
              customCellToTheLeft.canvasPositionX + customCellToTheLeft.width;
          }

          let canvasPositionX;
          if (currentLayoutColumnIndex === 0) {
            canvasPositionX = 20;
          } else {
            canvasPositionX = previousTableEndPositionX + 120;
          }

          let canvasPositionY;
          if (currentLayoutRowIndex === 0) {
            canvasPositionY = 20;
          } else {
            canvasPositionY = previousRowLargestY + 80;
          }

          let canvasCustomCell = CanvasCellFactory.createCustomCellForDatabaseTable(
                                                    canvas,
                                                    dbModel,
                                                    tableModel,
                                                    canvasPositionX,
                                                    canvasPositionY
                                                  );
          canvasCellsByTableModel.set(tableModel, canvasCustomCell);

          let customCellLargestY = canvasCustomCell.canvasPositionY + canvasCustomCell.height;
          if (customCellLargestY > currentRowLargestY) {
            currentRowLargestY = customCellLargestY;
          }

          createdCustomCellsGrid.add(canvasCustomCell);
        }
        currentLayoutColumnIndex++;
      });
      currentLayoutRowIndex++;
    });
    return canvasCellsByTableModel;
  }

  static isDisplayVisible(currentDisplayValue: string): boolean {
    let isDisplayVisible = true;
    // If the Current Display Value is equal to "none", then the Display is NOT visible, if it is equal to anything else, then the Display IS visible
    if (
      StringUtil.isNotEmpty(currentDisplayValue)
      && currentDisplayValue === "none"
    ) {
      isDisplayVisible = false;
    }
    return isDisplayVisible;
  }

  static createGridLayoutForTables(dbModel: DbModel, tablesPerCanvasRow: number): ObjectGrid<DbTableModel> {
    let tableLayoutGrid: ObjectGrid<DbTableModel> = new ObjectGrid<DbTableModel>( tablesPerCanvasRow );

    let linkCountsByTableId: Map<number, CanvasCellLinkCount> = new Map<number,CanvasCellLinkCount>();
    let tablesById: Map<number, DbTableModel> = new Map<number, DbTableModel>();

    dbModel.tables.forEach((tableModel: DbTableModel) => {
      tablesById.set(tableModel.id, tableModel);

      let linkCount = new CanvasCellLinkCount();
      linkCount.linkSourceCount = tableModel.foreignKeys.length;

      linkCountsByTableId.set(tableModel.id, linkCount);
    });

    dbModel.tables.forEach((tableModel: DbTableModel) => {
      tableModel.foreignKeys.forEach((foreignKeyModel: DbForeignKeyModel) => {
        let referencedTableModelId = foreignKeyModel.referencedTableId;
        let currentCountsForReferencedTable = linkCountsByTableId.get(referencedTableModelId);
        if (!currentCountsForReferencedTable) {
          console.log("Table Model ID [" + referencedTableModelId + "] did not have an entry in the Link Count Map");
        } else {
          currentCountsForReferencedTable.linkTargetCount = ++currentCountsForReferencedTable.linkTargetCount;
        }
      });
    });

    let tableModelsByReferenceCount: Map<number, DbTableModel[]> = new Map<number, DbTableModel[]>();
    linkCountsByTableId.forEach((linkCounts: CanvasCellLinkCount, tableId: number) => {
      let tableModel = tablesById.get(tableId);
      if (tableModel) {
        let tableModelsForReferenceCount: DbTableModel[] = [];
        let linkTargetCountForTable = linkCounts.linkTargetCount;
        let tableModelByReferenceCountEntry = tableModelsByReferenceCount.get(linkTargetCountForTable);
        if (tableModelByReferenceCountEntry) {
          tableModelsForReferenceCount = tableModelByReferenceCountEntry;
        } else {
          tableModelsByReferenceCount.set(
            linkTargetCountForTable,
            tableModelsForReferenceCount
          );
        }
        tableModelsForReferenceCount.push(tableModel);
      } else {
        console.log("Unable to find Table with ID [" + tableId + "]");
      }
    });

    let referenceCounts = Array.from(tableModelsByReferenceCount.keys())
                               .sort();
    referenceCounts.forEach((referenceCount: number) => {
      let tableModelsForReferenceCount = tableModelsByReferenceCount.get(referenceCount);
      if (tableModelsForReferenceCount) {
        let tablesByForeignKeyCount: Map<number, DbTableModel[]> = new Map<number, DbTableModel[]>();
        tableModelsForReferenceCount.forEach((tableModelForReferenceCount: DbTableModel) => {
          let foreignKeyCountForTable = tableModelForReferenceCount.foreignKeys.length;
          let currentTablesForForeignKeyCount = tablesByForeignKeyCount.get(foreignKeyCountForTable);
          if (!currentTablesForForeignKeyCount) {
            currentTablesForForeignKeyCount = [];
            tablesByForeignKeyCount.set(
              foreignKeyCountForTable,
              currentTablesForForeignKeyCount
            );
          }
          currentTablesForForeignKeyCount.push(tableModelForReferenceCount);
        });

        let foreignKeyCounts = Array.from(tablesByForeignKeyCount.keys())
                                    .sort();
        foreignKeyCounts.forEach((foreignKeyCount: number) => {
          let tablesForForeignKeyCount = tablesByForeignKeyCount.get(foreignKeyCount);
          if (tablesForForeignKeyCount) {
            tablesForForeignKeyCount.forEach((tableForForeignKeyCount: DbTableModel) => {
              tableLayoutGrid.add(tableForForeignKeyCount);
            });
          } else {
            console.warn("Failed to find the Tables associated to the Foreign Key Count [" + tablesForForeignKeyCount + "]");
          }
          if (foreignKeyCount === 0 && referenceCount === 0) {
            tableLayoutGrid.fillUpRemainingRowWithBlankValues();
          }
        });
      } else {
        console.warn("Failed to find the Tables associated to the Reference Count [" + referenceCount + "]");
      }
    });

    return tableLayoutGrid;
  }

  static getCurrentDisplayValueForLink(link: shapes.standard.Link): string {
    return link.attr("./display");
  }

  static createDatabaseTableForeignKeyLocalName(dbModel: DbModel, tableModel: DbTableModel, columnModel: DbColumnModel, referencedTableModel: DbTableModel, referencedColumnModel: DbColumnModel): string {
    return (
      "FK-" +
      dbModel.name.getFullPath() +
      "." +
      tableModel.name +
      "." +
      columnModel.name +
      "-to-" +
      referencedTableModel.name +
      "." +
      referencedColumnModel.name
    );
  }

  static createDatabaseTableLocalName(dbModel: DbModel, tableModel: DbTableModel): string {
    return "Table-" + dbModel.name.getFullPath() + "." + tableModel.name;
  }

  static createDatabaseLocalName(dbModel: DbModel): string {
    return "DB-" + dbModel.name.getFullPath();
  }

  private static createCustomCellForDatabaseTable(canvas: Canvas, dbModel: DbModel, tableModel: DbTableModel, canvasPositionX: number, canvasPositionY: number): CanvasCustomCell {
    let heightOfTable =CanvasCellFactory.getCustomCellHeightForDatabaseTable(tableModel);
    let widthOfTable =CanvasCellFactory.getCustomCellWidthForDatabaseTable(tableModel);
    let customCellName = CanvasCellFactory.getUniqueComponentForCellName();
    let customCellLocalName = CanvasCellFactory.createDatabaseTableLocalName(dbModel, tableModel);
    let customCellHtml = CanvasCellFactory.createHtmlForDatabaseTable(customCellName, tableModel, canvas, dbModel);

    return new CanvasCustomCell().initialize(
      -1,
      canvas.id,
      customCellName,
      customCellLocalName,
      customCellHtml,
      heightOfTable,
      widthOfTable,
      canvasPositionX,
      canvasPositionY
    );
  }

  // HTML
  private static createHtmlForDatabaseTable(customCellName: string, tableModel: DbTableModel, canvas: Canvas, dbModel: DbModel): string {
    let tableName = tableModel.name;

    let databaseTableComponentForHtmlId =dbModel.createHtmlTableIdForDatabaseTable(tableModel);
    let canvasCustomCellHtmlId = canvas.createHtmlIdForCanvasCustomCell(customCellName);
    canvasCustomCellHtmlId = canvasCustomCellHtmlId + HTML_ID_COMPONENT_DELIMITER + databaseTableComponentForHtmlId;

    let htmlTableBaseId = canvasCustomCellHtmlId + HTML_ID_COMPONENT_DELIMITER + "HtmlTable";
    let htmlTableHeaderBaseId = htmlTableBaseId + "_Header";
    let htmlTableBodyBaseId = htmlTableBaseId + "_Body";

    let tableHeaderRows = CanvasCellFactory.createHtmlTableHeader( tableName, htmlTableHeaderBaseId );
    let tableRows = CanvasCellFactory.createHtmlForAllDatabaseTableColumns( tableModel, htmlTableBodyBaseId );

    let tableHeaderHtml =
    `
      <table class="table table-sm table-hover table-jointjs-cell" id="${htmlTableBaseId}">
          <thead id="${htmlTableHeaderBaseId}">
            ${tableHeaderRows}
          </thead>
          <tbody id="${htmlTableBodyBaseId}">
            ${tableRows}
          </tbody>
      </table>
    `;
    return tableHeaderHtml;
  }

  private static createHtmlTableHeader(tableName: string, baseHtmlId: string): string {
    let htmlTableHeaderRowId = baseHtmlId + "_HeaderTableRow";
    let htmlTableHeaderThId = htmlTableHeaderRowId + "_HeaderTh";

    let tableHeaderHtml =
    `
      <tr class="table-header-row-jointjs-cell" id="${htmlTableHeaderRowId}">
          <th class="table-header-jointjs-cell" id="${htmlTableHeaderThId}">
              ${tableName}
          </th>
      </tr>
    `;
    return tableHeaderHtml;
  }

  private static createHtmlForAllDatabaseTableColumns(tableModel: DbTableModel, baseHtmlId: string): string {
    let htmlForAllTableRows = "";
    let tableName = tableModel.name;
    let columnModels = tableModel.columns ? tableModel.columns : [];
    let primaryKeyModel = tableModel.primaryKey;
    let foreignKeyModels = tableModel.foreignKeys;
    if (!primaryKeyModel) {
      console.log("No primary key defined for table [" + tableName + "]");
    }

    let primaryKeyColumnNames = CanvasCellFactory.extractColumnNamesForPrimaryKeyModel( primaryKeyModel, columnModels );
    let foreignKeyColumnNames = CanvasCellFactory.extractColumnNamesForForeignKeyModels( foreignKeyModels, columnModels );

    columnModels.sort(CanvasCellFactory.sortColumnModelsByColumnIndex);
    columnModels.forEach((columnModel: DbColumnModel) => {
      let htmlForTableRow = CanvasCellFactory.createHtmlForDatabaseTableColumn(
                                                                                  tableName,
                                                                                  columnModel,
                                                                                  primaryKeyColumnNames,
                                                                                  foreignKeyColumnNames,
                                                                                  baseHtmlId
                                                                                );

      htmlForAllTableRows = htmlForAllTableRows + htmlForTableRow;
    });
    return htmlForAllTableRows;
  }

  private static createHtmlForDatabaseTableColumn(tableName: string, columnModel: DbColumnModel, primaryKeyColumnNames: string[], foreignKeyColumnNames: string[], baseHtmlId: string): string {
    let columnName = columnModel.name;
    let tableDataRowId = baseHtmlId + "_TableDataRow." + columnName;
    let tableDataId = tableDataRowId + "_TableData";

    let tableDataColumnNameId = tableDataRowId + "_ColumnName";
    let tableDataColumnTypeId = tableDataRowId + "_ColumnType";
    let tableDataColumnIconSpanId = tableDataRowId + "_ColumnIconSpan";
    let tableDataIconId = tableDataRowId + "_TableData";

    let columnDataTypeString =
      "(" + columnModel.dataType.name.toLowerCase() + ")";

    let columnIcon = "";
    if (primaryKeyColumnNames.includes(columnName)) {
      columnIcon =
      `
        <img class="table-data-column-icon-jointjs-cell" src="${PRIMARY_KEY_ICON_PATH}" id="${tableDataIconId}"/>
      `;
    } else if (foreignKeyColumnNames.includes(columnName)) {
      columnIcon =
      `
        <img class="table-data-column-icon-jointjs-cell" src="${FOREIGN_KEY_ICON_PATH}" id="${tableDataIconId}"/>
      `;
    }

    let tableDataColorClass = "";
    if (columnModel.columnCategory.name === "Audit") {
      tableDataColorClass = "table-header-audit-field";
    } else if (columnModel.columnCategory.name === "Identity") {
      tableDataColorClass = "table-header-audit-field";
    }

    let tableRow =
    `
      <tr class="table-body-row-jointjs-cell" id="${tableDataRowId}">
        <td class="table-data-jointjs-cell ${tableDataColorClass}" id="${tableDataId}">
          <span class="table-data-column-name-jointjs-cell" id="${tableDataColumnNameId}">${columnName}</span>
          <span class="table-data-column-data-type-jointjs-cell" id="${tableDataColumnTypeId}"> ${columnDataTypeString}</span>
          <span class="table-data-column-icon-span-jointjs-cell" id="${tableDataColumnIconSpanId}">${columnIcon}</span>
        </td>
      </tr>
    `;
    return tableRow;
  }

  private static extractColumnNamesForPrimaryKeyModel(primaryKeyModel: DbPrimaryKeyModel, columnModels: DbColumnModel[]): string[] {
    let primaryKeyColumnNames: string[] = [];
    let primaryKeyModelColumns = primaryKeyModel.primaryKeyColumns;
    primaryKeyModelColumns.forEach((primaryKeyModelColumn: DbPrimaryKeyColumnModel) => {
      let columnModel = columnModels.find((columnModel: DbColumnModel) => {
        columnModel.id === primaryKeyModelColumn.columnId
      });
      if (!columnModel) {
        console.log("Failed to find the Column Model for the Primary Key using ID [" + primaryKeyModelColumn.columnId + "]");
      } else {
        primaryKeyColumnNames.push(columnModel.name);
      }
    });
    return primaryKeyColumnNames;
  }

  private static extractColumnNamesForForeignKeyModels(foreignKeyModels: DbForeignKeyModel[], columnModels: DbColumnModel[]): string[] {
    let foreignKeyColumnNames: string[] = [];
    foreignKeyModels.forEach((foreignKeyModel: DbForeignKeyModel) => {
      let columnModel = columnModels.find((columnModel: DbColumnModel) => {
        return columnModel.id === foreignKeyModel.localColumnId;
      });
      if (!columnModel) {
        console.log("Failed to find the Column Model for the Foreign Key using ID [" + foreignKeyModel.localColumnId + "]");
      } else {
        foreignKeyColumnNames.push(columnModel.name);
      }
    });
    return foreignKeyColumnNames;
  }

  private static getCustomCellWidthForDatabaseTable(tableModel: DbTableModel): number {
    let longestColumnName = CanvasCellFactory.getLongestNameForDatabaseTableModel(tableModel);

    return CanvasCellFactory.getTextWidth(
      longestColumnName,
      "12pt Segoe UI"
    );
  }

  private static getCustomCellHeightForDatabaseTable(tableModel: DbTableModel): number {
    let numberOfColumns = tableModel.columns.length;
    let fullHtmlTableHeight = CANVAS_DATABASE_TABLE_DEFAULT_HEADER_HEIGHT + CANVAS_DATABASE_TABLE_DEFAULT_HEADER_BORDER_HEIGHT;
    let heightOfTable = numberOfColumns * CANVAS_DATABASE_TABLE_DEFAULT_COLUMN_HEIGHT + fullHtmlTableHeight;

    return heightOfTable;
  }

  private static getLongestNameForDatabaseTableModel(tableModel: DbTableModel) {
    let longestName = "";

    // Check the name of the Table itself first
    let tableName = tableModel.name;
    let tableNameLength = tableModel.name.length;
    if (tableNameLength > longestName.length) {
      longestName = tableName;
    }

    // Then compare against all of the Column names within the Table, including the Data Type postfix
    tableModel.columns.forEach((columnModel: DbColumnModel) => {
      let columnNameWithDataType = columnModel.name + " (" + columnModel.dataType + ")";
      if (columnNameWithDataType.length > longestName.length) {
        longestName = columnNameWithDataType;
      }
    });
    return longestName;
  }

  // Canvas Cells

  private static sortTableModelsByForeignKeyCount(tableModelA: DbTableModel, tableModelB: DbTableModel): number {
    let sortValue;
    let numberOfForeignKeysA = tableModelA.foreignKeys.length;
    let numberOfForeignKeysB = tableModelB.foreignKeys.length;
    if (numberOfForeignKeysA > numberOfForeignKeysB) {
      sortValue = -1;
    } else if (numberOfForeignKeysA < numberOfForeignKeysB) {
      sortValue = 1;
    } else {
      sortValue = 0;
    }
    return sortValue;
  }

  private static sortColumnModelsByColumnIndex(columnModelA: DbColumnModel, columnModelB: DbColumnModel): number {
    let sortValue;
    let aIndex = columnModelA.columnIndex;
    let bIndex = columnModelB.columnIndex;
    if (aIndex < bIndex) {
      sortValue = -1;
    } else if (aIndex > bIndex) {
      sortValue = 1;
    } else {
      sortValue = 0;
    }
    return sortValue;
  }

  private static updateTextToProperCase(text: string): string {
    let textProperCase = "";
    if (text && text.length > 0) {
      textProperCase = text.charAt(0).toUpperCase();
      if (text.length > 1) {
        textProperCase += text.slice(1).toLowerCase();
      }
    }
    return textProperCase;
  }

  private static getTextWidth(text: string, font: string): number {
    let width = 0;
    let canvas = document.createElement("canvas");
    canvas.setAttribute("font-size", "14px");
    let context = canvas.getContext("2d");
    if (context != null) {
      context.font = font;
      let metrics = context.measureText(text);
      width = metrics.width;
    }
    return width;
  }

  private static getUniqueComponentForCellName(): string {
    return crypto.randomUUID();
  }

}
