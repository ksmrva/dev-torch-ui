import { dia } from "@joint/core";
import { CANVAS_CUSTOM_CELL_JOINT_TYPE_NAME } from "../cell/custom/canvas-custom-cell";
import { CanvasCell } from "../cell/canvas-cell";
import { CanvasCellFactory } from "../cell/factory/canvas-cell-factory";
import { CANVAS_LINK_CELL_JOINT_TYPE_NAME } from "../cell/link/canvas-link-cell";
import { Canvas } from "../canvas";

export class CanvasFactory {

  static createCanvasFromJointJsGraph( jointGraph: dia.Graph, jointPaper: dia.Paper ): Canvas {
    let canvasId = Canvas.getCurrentJointCanvasId(jointGraph);
    let canvasName = Canvas.getCurrentJointCanvasName(jointGraph);

    let canvasCells: CanvasCell[] = [];
    jointGraph.getCells().forEach((cellFromJointGraph: dia.Cell) => {
      let cellType = cellFromJointGraph.attributes["type"];
      if (cellType === CANVAS_LINK_CELL_JOINT_TYPE_NAME) {
        canvasCells.push(
          CanvasCellFactory.createCanvasLinkCellFromJointCell(
            cellFromJointGraph,
            canvasId
          )
        );
      } else if (cellType === CANVAS_CUSTOM_CELL_JOINT_TYPE_NAME) {
        canvasCells.push(
          CanvasCellFactory.createCanvasCustomCellFromJointCell(
            cellFromJointGraph,
            canvasId
          )
        );
      } else {
        throw new Error("Unrecognized Canvas Cell Type [" + cellType + "]");
      }
    });

    let paperHeight = jointPaper.options.height;
    if (!paperHeight) {
      paperHeight = 0;
    }
    let paperWidth = jointPaper.options.width;
    if (!paperWidth) {
      paperWidth = 0;
    }
    let paperBackgroundColor = jointPaper.options.background?.color;
    if (!paperBackgroundColor) {
      paperBackgroundColor = "";
    }

    let canvas = new Canvas();
    canvas.id = canvasId;
    canvas.name = canvasName;
    canvas.height = +paperHeight;
    canvas.width = +paperWidth;
    canvas.backgroundColor = paperBackgroundColor;
    canvas.cells = canvasCells;
    return canvas;
  }

}
