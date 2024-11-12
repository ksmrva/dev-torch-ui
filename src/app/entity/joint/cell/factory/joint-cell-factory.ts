import { dia, shapes, util } from "@joint/core";
import { CANVAS_CUSTOM_CELL_JOINT_TYPE_NAME, CanvasCustomCell } from "../../../canvas/cell/custom/canvas-custom-cell";
import { CanvasCell } from "../../../canvas/cell/canvas-cell";
import { CanvasCellFactory } from "../../../canvas/cell/factory/canvas-cell-factory";
import { CanvasLinkCell } from "../../../canvas/cell/link/canvas-link-cell";

export class JointCellFactory {

  static createJointLinkFromCanvasLink( graph: dia.Graph, canvasLinkCell: CanvasLinkCell ): shapes.standard.Link {
    let sourceCellName = canvasLinkCell.sourceCellLocalName;
    let targetCellName = canvasLinkCell.targetCellLocalName;

    let sourceCell = graph.getCells().find((cell: dia.Cell) => {
      return CanvasCell.getCurrentJointCellLocalName(cell) === sourceCellName;
    });
    if (!sourceCell) {
      throw new Error( "Failed to find the Source Cell [" + sourceCellName + "]" );
    }

    let targetCell = graph.getCells().find((cell: dia.Cell) => {
      return CanvasCell.getCurrentJointCellLocalName(cell) === targetCellName;
    });
    if (!targetCell) {
      throw new Error( "Failed to find the Target Cell [" + targetCellName + "] for Source Cell [" + sourceCellName + "]" );
    }

    let sourceDx = canvasLinkCell.linkSourceDx;
    let sourceDy = canvasLinkCell.linkSourceDy;

    let targetDx = canvasLinkCell.linkTargetDx;
    let targetDy = canvasLinkCell.linkTargetDy;

    let sourceX = sourceCell.position().x;
    let sourceY = sourceCell.position().y;

    let targetX = targetCell.position().x;
    let targetY = targetCell.position().y;

    let sourceAnchorName;
    let targetAnchorName;
    let sourceToTargetRelativePosition;
    let targetToSourceRelativePosition;
    if (sourceX > targetX) {
      sourceAnchorName = "topLeft";
      targetAnchorName = "topRight";
      sourceToTargetRelativePosition = "right";
      targetToSourceRelativePosition = "left";
    } else {
      sourceAnchorName = "topRight";
      targetAnchorName = "topLeft";
      sourceToTargetRelativePosition = "left";
      targetToSourceRelativePosition = "right";
    }

    const link = new shapes.standard.Link();
    link.source(sourceCell, {
      anchor: {
        name: sourceAnchorName,
        args: {
          dx: sourceDx,
          dy: sourceDy,
        },
      },
      connectionPoint: {
        name: "anchor",
      }
    });
    link.target(targetCell, {
      anchor: {
        name: targetAnchorName,
        args: {
          dx: targetDx,
          dy: targetDy,
        },
      },
      connectionPoint: {
        name: "anchor",
      }
    });
    link.attr({
      line: {
        sourceMarker: {
          id: "erd.arrowhead.one-and-only-one-releationship",
        },
        // targetMarker: {
        //   id: "erd.arrowhead.zero-releationship"
        // }
      }
    });

    // link.router("manhattan");
    // link.connector("jumpover");

    CanvasLinkCell.initializeJointLinkValues(
      canvasLinkCell.id,
      canvasLinkCell.name,
      canvasLinkCell.localName,
      sourceCellName,
      sourceDx,
      sourceDy,
      targetCellName,
      targetDx,
      targetDy,
      link
    );

    // Set Custom Joint Values for the Link Source
    CanvasCustomCell.addJointCellLink(link, sourceCell);
    CanvasCustomCell.updateJointLinkedCell(
      link.id.toString(),
      targetCell,
      sourceCell
    );
    CanvasCustomCell.updateJointRelativePositionToOtherCell(
      targetCellName,
      sourceToTargetRelativePosition,
      sourceCell
    );

    // Set Custom Joint Values for the Link Target
    CanvasCustomCell.addJointCellLink(link, targetCell);
    CanvasCustomCell.updateJointLinkedCell(
      link.id.toString(),
      sourceCell,
      targetCell
    );
    CanvasCustomCell.updateJointRelativePositionToOtherCell(
      sourceCellName,
      targetToSourceRelativePosition,
      targetCell
    );

    return link;
  }

  static createJointCustomCellForCanvasCustomCell( jointJsGraph: dia.Graph, canvasCustomCell: CanvasCustomCell ): dia.Element {
    let html = canvasCustomCell.html;
    let widthOfTable = canvasCustomCell.width;
    let heightOfTable = canvasCustomCell.height;

    // Initialize the position of the Cell to (0,0), then move the Cell into the actual position we want using translate(); this aLLows the Graph to track all of the Cells movements properly
    let initialCanvasPositionX = 0;
    let initialCanvasPositionY = 0;
    let canvasPositionX = canvasCustomCell.canvasPositionX;
    let canvasPositionY = canvasCustomCell.canvasPositionY;

    let foreignObjectTypeName = CANVAS_CUSTOM_CELL_JOINT_TYPE_NAME;
    const TableForeignObject = dia.Element.define(
      foreignObjectTypeName,
      {
        attrs: {
          foreignObject: {
            x: initialCanvasPositionX,
            y: initialCanvasPositionY,
            width: widthOfTable,
            height: heightOfTable,
          },
          customCellHtmlContainer: {},
        },
      },
      {
        markup: util.svg
        `
          <foreignObject @selector="foreignObject">
              <div xmlns="http://www.w3.org/1999/xhtml" @selector="customCellHtmlContainer">
                  ${html}
              </div>
          </foreignObject>
        `,
      }
    );

    const customCell = new TableForeignObject();
    customCell.translate(canvasPositionX, canvasPositionY);

    CanvasCustomCell.initializeJointCustomValues(
      canvasCustomCell.id,
      canvasCustomCell.name,
      canvasCustomCell.localName,
      html,
      [],
      new Map<string, dia.Cell>(),
      new Map<string, string>(),
      customCell
    );

    customCell.on("change", (updatedCustomCell) => {
      let updatedLinks = JointCellFactory.updateCellLinksIfNeeded( updatedCustomCell, canvasCustomCell, jointJsGraph );

      updatedLinks.forEach((updatedLink: shapes.standard.Link, oldLink: shapes.standard.Link) => {
        // Remove Old Link and any of its related Joint Custom values
        oldLink.remove();
        CanvasCustomCell.removeJointCellLink(oldLink, updatedCustomCell);
        CanvasCustomCell.removeJointLinkedCell( oldLink.id.toString(), updatedCustomCell );

        // Set the New Link"s visibility to be the same as the Old Link"s visibility
        let currentDisplayForOldLink = CanvasCellFactory.getCurrentDisplayValueForLink(oldLink);
        if (CanvasCellFactory.isDisplayVisible(currentDisplayForOldLink)) {
          updatedLink.attr("./display", "");
        } else {
          updatedLink.attr("./display", "none");
        }

        // Then add the Updated Link to the Graph
        updatedLink.addTo(jointJsGraph);
      });
    });

    return customCell;
  }

  private static updateCellLinksIfNeeded( updatedCustomCell: dia.Cell, canvasCustomCell: CanvasCustomCell, jointJsGraph: dia.Graph ): Map<shapes.standard.Link, shapes.standard.Link> {
    let linkedCells = CanvasCustomCell.getCurrentJointLinkedCells(updatedCustomCell);
    let updatedCellLinks: Map<shapes.standard.Link, shapes.standard.Link> = new Map<shapes.standard.Link, shapes.standard.Link>();
    let cellLinks = CanvasCustomCell.getCurrentJointCellLinks(updatedCustomCell);
    cellLinks.forEach((cellLink: shapes.standard.Link) => {
      let updatedCellLink = JointCellFactory.createUpdatedCellLinkIfNeeded(
        cellLink,
        updatedCustomCell,
        linkedCells,
        canvasCustomCell.canvasId,
        jointJsGraph
      );
      if (updatedCellLink) {
        updatedCellLinks.set(cellLink, updatedCellLink);
      }
    });

    return updatedCellLinks;
  }

  private static createUpdatedCellLinkIfNeeded(cellLink: shapes.standard.Link, updatedCustomCell: dia.Cell, linkedCells: Map<string, dia.Cell>, canvasId: number, jointJsGraph: dia.Graph): shapes.standard.Link | null {
    let updatedCellLink: shapes.standard.Link | null;
    let linkedCell = linkedCells.get(cellLink.id.toString());
    if (linkedCell) {
      let updatedCellName = CanvasCell.getCurrentJointCellLocalName(updatedCustomCell);
      let updatedCellXPosition = updatedCustomCell.position().x;
      let updatedCellYPosition = updatedCustomCell.position().y;

      let linkedCellName = CanvasCell.getCurrentJointCellLocalName(linkedCell);
      let linkedCellXPosition = linkedCell.position().x;
      let linkedCellYPosition = linkedCell.position().y;

      let currentLinkedCellsRelativePosition = CanvasCustomCell.getCurrentJointRelativePositionToOtherCells( updatedCustomCell );

      let updatedPositionRelativeToLinkedCell = "unknown";
      let updatedPositionOfLinkedCellRelativeToUpdatedCell = "unknown";
      if (updatedCellXPosition === linkedCellXPosition) {
        updatedPositionRelativeToLinkedCell = "same";
      } else if (updatedCellXPosition < linkedCellXPosition) {
        updatedPositionRelativeToLinkedCell = "left";
        updatedPositionOfLinkedCellRelativeToUpdatedCell = "right";
      } else {
        updatedPositionRelativeToLinkedCell = "right";
        updatedPositionOfLinkedCellRelativeToUpdatedCell = "left";
      }

      let relativePosition = currentLinkedCellsRelativePosition.get(linkedCellName);
      if (relativePosition) {
        if (relativePosition !== updatedPositionRelativeToLinkedCell) {
          let idInit = CanvasCell.getCurrentJointCellId(cellLink);
          let nameInit = CanvasCell.getCurrentJointCellName(cellLink);
          let localNameInit = CanvasCell.getCurrentJointCellLocalName(cellLink);
          let sourceCellNameInit = CanvasLinkCell.getCurrentJointSourceCellName(cellLink);
          let targetCellNameInit = CanvasLinkCell.getCurrentJointTargetCellName(cellLink);
          let linkSourceDxInit = CanvasLinkCell.getCurrentJointSourceCellDx(cellLink);
          let linkSourceDyInit = CanvasLinkCell.getCurrentJointSourceCellDy(cellLink);
          let linkTargetDxInit = CanvasLinkCell.getCurrentJointTargetCellDx(cellLink);
          let linkTargetDyInit = CanvasLinkCell.getCurrentJointTargetCellDy(cellLink);

          let canvasLinkCellForUpdatedLink = new CanvasLinkCell();
          canvasLinkCellForUpdatedLink.initialize(
            idInit,
            canvasId,
            nameInit,
            localNameInit,
            sourceCellNameInit,
            targetCellNameInit,
            linkSourceDxInit,
            linkSourceDyInit,
            linkTargetDxInit,
            linkTargetDyInit
          );
          updatedCellLink = JointCellFactory.createJointLinkFromCanvasLink(
            jointJsGraph,
            canvasLinkCellForUpdatedLink
          );
        } else {
          updatedCellLink = null;
        }
      } else {
        // TODO: Warning
        updatedCellLink = null;
        console.log("Cell [" + updatedCellName + "] was moved and is linked to Cell [" + linkedCellName + "] but has no tracked Relative Position");
      }
    } else {
      updatedCellLink = null;
    }
    return updatedCellLink;
  }
}
