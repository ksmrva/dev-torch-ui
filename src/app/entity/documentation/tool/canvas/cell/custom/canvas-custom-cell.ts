import { dia, shapes } from "@joint/core";
import { CanvasCell } from "../canvas-cell";
import { JointValueAccessor } from "../../../../../shared/joint/value/joint-value-accessor";

export const CANVAS_CUSTOM_CELL_JOINT_TYPE_NAME: string = "torch.jointjs.element.custom.TableForeignObject";

export const CANVAS_CUSTOM_CELL_NAME_COMMON_TAG: string = "cell-custom";

export const CELL_HTML_JOINT_KEY: string = "canvasCellHtml";
export const CELL_LINKS_JOINT_KEY: string = "canvasCellLinks";
export const LINKED_CELLS_JOINT_KEY: string = "canvasCellLinkedCells";
export const RELATIVE_POSITION_TO_OTHER_CELLS_JOINT_KEY: string = "canvasCellRelativePositionToOtherCells";

export class CanvasCustomCell extends CanvasCell {

  "@type": string = "custom";

  html: string;

  height: number;

  width: number;

  canvasPositionX: number;

  canvasPositionY: number;

  constructor() {
    super();

    this.html = "";
    this.height = 0;
    this.width = 0;
    this.canvasPositionX = 0;
    this.canvasPositionY = 0;
  }

  initialize(
    idInit: number,
    canvasIdInit: number,
    nameInit: string,
    localName: string,
    htmlInit: string,
    heightInit: number,
    widthInit: number,
    canvasPositionXInit: number,
    canvasPositionYInit: number
  ): CanvasCustomCell {
    super.initializeBaseValues(
      idInit,
      canvasIdInit,
      nameInit,
      localName
    );
    this.canvasId = canvasIdInit;
    this.globalName = nameInit;
    this.html = htmlInit;
    this.height = heightInit;
    this.width = widthInit;
    this.canvasPositionX = canvasPositionXInit;
    this.canvasPositionY = canvasPositionYInit;

    return this;
  }

  override deserialize(json: any): CanvasCustomCell {
    super.deserialize(json);
    if (json) {
      this.html = json.html;
      this.height = json.height;
      this.width = json.width;
      this.canvasPositionX = json.canvasPositionX;
      this.canvasPositionY = json.canvasPositionY;
    }
    return this;
  }

  override isEqualTo(otherEntity: CanvasCustomCell): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.html === otherEntity.html
        && this.height === otherEntity.height
        && this.width === otherEntity.width
        && this.canvasPositionX === otherEntity.canvasPositionX
        && this.canvasPositionY === otherEntity.canvasPositionY) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

  static createHtmlIdForCustomCellElement(customCellName: string): string {
    return "CustomCell." + customCellName;
  }

  static createDatabaseTableCustomCellName( canvasName: string, databaseName: string, schemaName: string, tableName: string ): string {
    let customCellNamePrefix = CanvasCustomCell.createCellNamePrefixForCanvasCustomCell( canvasName );
    let databaseTableTag = CanvasCustomCell.createDatabaseTableTag(
      databaseName,
      schemaName,
      tableName
    );

    return customCellNamePrefix + "." + databaseTableTag;
  }

  static createCellNamePrefixForCanvasCustomCell( canvasName: string ): string {
    return canvasName + "." + CANVAS_CUSTOM_CELL_NAME_COMMON_TAG;
  }

  // Initialize Joint Values
  static initializeJointCustomValues(
    cellId: number,
    cellGlobalName: string,
    cellLocalName: string,
    htmlInit: string,
    cellLinksInit: shapes.standard.Link[],
    linkedCellsInit: Map<string, dia.Cell>,
    linkedCellsRelativePositionInit: Map<string, string>,
    jointCell: dia.Cell
  ): void {
    CanvasCell.initializeJointCellValues(
      cellId,
      cellGlobalName,
      cellLocalName,
      jointCell
    );
    let html: string;
    if (htmlInit !== null && htmlInit !== undefined) {
      html = htmlInit;
    } else {
      html = "";
    }

    let cellLinks: shapes.standard.Link[];
    if (cellLinksInit) {
      cellLinks = cellLinksInit;
    } else {
      cellLinks = [];
    }

    let linkedCells: Map<string, dia.Cell>;
    if (linkedCellsInit) {
      linkedCells = linkedCellsInit;
    } else {
      linkedCells = new Map<string, dia.Cell>();
    }

    let linkedCellsRelativePosition: Map<string, string>;
    if (linkedCellsRelativePositionInit) {
      linkedCellsRelativePosition = linkedCellsRelativePositionInit;
    } else {
      linkedCellsRelativePosition = new Map<string, string>();
    }
    JointValueAccessor.initializeValue( CELL_HTML_JOINT_KEY, html, jointCell );
    JointValueAccessor.initializeValue( CELL_LINKS_JOINT_KEY, cellLinks, jointCell );
    JointValueAccessor.initializeValue( LINKED_CELLS_JOINT_KEY, linkedCells, jointCell );
    JointValueAccessor.initializeValue( RELATIVE_POSITION_TO_OTHER_CELLS_JOINT_KEY, linkedCellsRelativePosition, jointCell );
  }

  // Get Initial Joint Values
  static getInitialJointCellHtml(jointCell: dia.Cell): string {
    return JointValueAccessor.getInitialValue( CELL_HTML_JOINT_KEY, jointCell );
  }
  static getInitialJointCellLinks(jointCell: dia.Cell): shapes.standard.Link[] {
    return JointValueAccessor.getInitialValue( CELL_LINKS_JOINT_KEY, jointCell );
  }
  static getInitialJointLinkedCells( jointCell: dia.Cell ): Map<string, dia.Cell> {
    return JointValueAccessor.getInitialValue( LINKED_CELLS_JOINT_KEY, jointCell );
  }
  static getInitialJointRelativePositionToOtherCells( jointCell: dia.Cell ): Map<string, string> {
    return JointValueAccessor.getInitialValue( RELATIVE_POSITION_TO_OTHER_CELLS_JOINT_KEY, jointCell );
  }

  // Get Current Joint Values
  static getCurrentJointCellHtml(jointCell: dia.Cell): string {
    return JointValueAccessor.getCurrentValue( CELL_HTML_JOINT_KEY, jointCell );
  }
  static getCurrentJointCellLinks(jointCell: dia.Cell): shapes.standard.Link[] {
    return JointValueAccessor.getCurrentValue( CELL_LINKS_JOINT_KEY, jointCell );
  }
  static getCurrentJointLinkedCells( jointCell: dia.Cell ): Map<string, dia.Cell> {
    return JointValueAccessor.getCurrentValue( LINKED_CELLS_JOINT_KEY, jointCell );
  }
  static getCurrentJointRelativePositionToOtherCells( jointCell: dia.Cell ): Map<string, string> {
    return JointValueAccessor.getCurrentValue( RELATIVE_POSITION_TO_OTHER_CELLS_JOINT_KEY, jointCell );
  }

  // Set Joint Values
  static setJointCellHtml(html: string, jointCell: dia.Cell): void {
    return JointValueAccessor.setCurrentValue( CELL_HTML_JOINT_KEY, html, jointCell );
  }
  static addJointCellLink( cellLink: shapes.standard.Link, jointCell: dia.Cell ): void {
    let currentCellLinks = CanvasCustomCell.getCurrentJointCellLinks(jointCell);
    if (!currentCellLinks.includes(cellLink)) {
      currentCellLinks.push(cellLink);
    }
  }
  static removeJointCellLink( cellLink: shapes.standard.Link, jointCell: dia.Cell ): void {
    let currentCellLinks = CanvasCustomCell.getCurrentJointCellLinks(jointCell);
    let cellLinkIndex = currentCellLinks.indexOf(cellLink);
    if (cellLinkIndex > -1) {
      currentCellLinks.slice(cellLinkIndex);
    }
  }
  static updateJointLinkedCell( linkId: string, linkedCell: dia.Cell, jointCell: dia.Cell ): void {
    let currentLinkedCells = CanvasCustomCell.getCurrentJointLinkedCells(jointCell);
    currentLinkedCells.set(linkId, linkedCell);
  }
  static removeJointLinkedCell(linkId: string, jointCell: dia.Cell): void {
    let currentLinkedCells = CanvasCustomCell.getCurrentJointLinkedCells(jointCell);
    currentLinkedCells.delete(linkId);
  }
  static updateJointRelativePositionToOtherCell( cellId: string, relativePosition: string, jointCell: dia.Cell ): void {
    let currentRelativePositionToOtherCells = CanvasCustomCell.getCurrentJointRelativePositionToOtherCells( jointCell );
    currentRelativePositionToOtherCells.set(cellId, relativePosition);
  }
  static removeJointRelativePositionToOtherCell( cellId: string, jointCell: dia.Cell ): void {
    let currentRelativePositionToOtherCells = CanvasCustomCell.getCurrentJointRelativePositionToOtherCells( jointCell );
    currentRelativePositionToOtherCells.delete(cellId);
  }
}
