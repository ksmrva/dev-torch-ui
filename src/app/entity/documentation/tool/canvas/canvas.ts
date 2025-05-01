import { dia } from "@joint/core";
import { ApiEntity } from "../../../shared/api-entity";
import { JointValueAccessor } from "../../../shared/joint/value/joint-value-accessor";
import { CanvasCustomCell } from "./cell/custom/canvas-custom-cell";
import { CanvasCell } from "./cell/canvas-cell";
import { CanvasCellFactory } from "./cell/factory/canvas-cell-factory";

export const INITIAL_VALUE_TAG: string = "_initial";
export const UPDATED_VALUE_TAG: string = "_updated";

export const CANVAS_ID_KEY: string = "canvasId";
export const CANVAS_NAME_KEY: string = "canvasName";

export const CANVAS_DEFAULT_BACKGROUND_COLOR_VALUE: string = "#FFFFFF";

export class Canvas extends ApiEntity {

  name: string;

  height: number;

  width: number;

  backgroundColor: string;

  cells: CanvasCell[];

  constructor() {
    super();

    this.name = "";
    this.height = 0;
    this.width = 0;
    this.backgroundColor = CANVAS_DEFAULT_BACKGROUND_COLOR_VALUE;
    this.cells = [];
  }

  createHtmlIdForCanvasCustomCell(customCellName: string): string {
    let htmlId = this.createHtmlIdForCanvasElement();

    let customCellComponentForId = CanvasCustomCell.createHtmlIdForCustomCellElement(customCellName);
    htmlId = htmlId + "_" + customCellComponentForId;

    return htmlId;
  }

  private createHtmlIdForCanvasElement(): string {
    return "Canvas." + this.name;
  }

  override deserialize(json: any): Canvas {
    super.deserialize(json);
    if (json) {
      this.name = json.name;
      this.height = json.height;
      this.width = json.width;
      this.backgroundColor = json.backgroundColor;

      let canvasCells: CanvasCell[] = [];
      let jsonForCells: any[] = json.cells;
      if (jsonForCells) {
        jsonForCells.forEach((jsonForCell: any) => {
          let canvasCell = CanvasCellFactory.deserialize(jsonForCell);
          if (canvasCell) {
            canvasCells.push(canvasCell);
          } else {
            console.log( "Tried to convert JSON for Cell [" + jsonForCell + "] into an Object but received a null" );
          }
        });
      }
      this.cells = canvasCells;
    }
    return this;
  }

  override isEqualTo(otherEntity: Canvas): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.name === otherEntity.name
        && this.height === otherEntity.height
        && this.width === otherEntity.width
        && this.backgroundColor === otherEntity.backgroundColor
        && this.cells.length === otherEntity.cells.length
      ) {
        let allCellsHaveMatch = true;
        for (let i = 0; i < this.cells.length; i++) {
          let cell = this.cells[i];
          let indexOfCell = otherEntity.cells.findIndex((otherCell: CanvasCell) => {
            return cell.isEqualTo(otherCell);
          });
          if (indexOfCell < 0) {
            allCellsHaveMatch = false;
            break;
          }
        }
        isEqualTo = allCellsHaveMatch;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

  // Initialize Joint Values
  static initializeJointCanvasValues( canvasId: number, canvasName: string, jointGraph: dia.Graph ): void {
    JointValueAccessor.initializeValue( CANVAS_ID_KEY, canvasId, jointGraph );
    JointValueAccessor.initializeValue( CANVAS_NAME_KEY, canvasName, jointGraph );
  }

  // Get Initial Joint Values
  static getInitialJointCanvasId(jointGraph: dia.Graph): number {
    return JointValueAccessor.getInitialValue( CANVAS_ID_KEY, jointGraph );
  }
  static getInitialJointCanvasName(jointGraph: dia.Graph): string {
    return JointValueAccessor.getInitialValue( CANVAS_NAME_KEY, jointGraph );
  }

  // Get Current Joint Values
  static getCurrentJointCanvasId(jointGraph: dia.Graph): number {
    return JointValueAccessor.getCurrentValue( CANVAS_ID_KEY, jointGraph );
  }
  static getCurrentJointCanvasName(jointGraph: dia.Graph): string {
    return JointValueAccessor.getCurrentValue( CANVAS_NAME_KEY, jointGraph );
  }

  // Set Joint Values
  static setJointCanvasId(canvasId: string, jointGraph: dia.Graph): void {
    JointValueAccessor.setCurrentValue( CANVAS_ID_KEY, canvasId, jointGraph );
  }

  static setJointCanvasName( canvasName: string, jointGraph: dia.Graph ): void {
    JointValueAccessor.setCurrentValue( CANVAS_NAME_KEY, canvasName, jointGraph );
  }

}
