import { dia } from "@joint/core";
import { JointModelValueAccessor } from "../../../joint/model/joint-model-value-accessor";
import { CanvasCell } from "../canvas-cell";

export const CANVAS_LINK_CELL_NAME_COMMON_TAG: string = "cell-link";

export const SOURCE_CELL_LOCAL_NAME_KEY: string = "canvasSourceCellLocalName";
export const SOURCE_CELL_DX_KEY: string = "canvasLinkSourceDx";
export const SOURCE_CELL_DY_KEY: string = "canvasLinkSourceDy";

export const TARGET_CELL_LOCAL_NAME_KEY: string = "canvasTargetCellLocalName";
export const TARGET_CELL_DX_KEY: string = "canvasLinkTargetDx";
export const TARGET_CELL_DY_KEY: string = "canvasLinkTargetDy";

export const CANVAS_LINK_CELL_JOINT_TYPE_NAME = "standard.Link";

export class CanvasLinkCell extends CanvasCell {

  "@type": string = "link";

  sourceCellLocalName: string;

  targetCellLocalName: string;

  linkSourceDx: number;

  linkSourceDy: number;

  linkTargetDx: number;

  linkTargetDy: number;


  constructor() {
    super();

    this.sourceCellLocalName = "";
    this.targetCellLocalName = "";

    this.linkSourceDx = 0;
    this.linkSourceDy = 0;
    this.linkTargetDx = 0;
    this.linkTargetDy = 0;
  }

  initialize(
    idInit: number,
    canvasIdInit: number,
    nameInit: string,
    localName: string,
    sourceCellLocalNameInit: string,
    targetCellLocalNameInit: string,
    linkSourceDxInit: number,
    linkSourceDyInit: number,
    linkTargetDxInit: number,
    linkTargetDyInit: number
): CanvasLinkCell {
    super.initializeBaseCellValues(
      idInit,
      canvasIdInit,
      nameInit,
      localName
    );
    this.sourceCellLocalName = sourceCellLocalNameInit;
    this.targetCellLocalName = targetCellLocalNameInit;
    this.linkSourceDx = linkSourceDxInit;
    this.linkSourceDy = linkSourceDyInit;
    this.linkTargetDx = linkTargetDxInit;
    this.linkTargetDy = linkTargetDyInit;

    return this;
  }

  override deserialize(json: any): CanvasLinkCell {
    super.deserialize(json);
    if (json) {
      this.sourceCellLocalName = json.sourceCellLocalName;
      this.targetCellLocalName = json.targetCellLocalName;
      this.linkSourceDx = json.linkSourceDx;
      this.linkSourceDy = json.linkSourceDy;
      this.linkTargetDx = json.linkTargetDx;
      this.linkTargetDy = json.linkTargetDy;
    }
    return this;
  }

  override isEqualTo(otherEntity: CanvasLinkCell): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (
      isEqualTo
      && this.sourceCellLocalName === otherEntity.sourceCellLocalName
      && this.targetCellLocalName === otherEntity.targetCellLocalName
      && this.linkSourceDx === otherEntity.linkSourceDx
      && this.linkSourceDy === otherEntity.linkSourceDy
      && this.linkTargetDx === otherEntity.linkTargetDx
      && this.linkTargetDy === otherEntity.linkTargetDy
    ) {
      isEqualTo = true;
    }
    return isEqualTo;
  }

  createFromJointCell( jointCell: dia.Cell, canvasId: number ): CanvasLinkCell {
    let id = CanvasCell.getCurrentJointCellId(jointCell);
    let cellName = CanvasCell.getCurrentJointCellName(jointCell);
    let cellLocalName = CanvasCell.getCurrentJointCellLocalName(jointCell);

    let sourceCellName = CanvasLinkCell.getCurrentJointSourceCellName(jointCell);
    let linkSourceDx = CanvasLinkCell.getCurrentJointSourceCellDx(jointCell);
    let linkSourceDy = CanvasLinkCell.getCurrentJointSourceCellDy(jointCell);

    let targetCellName = CanvasLinkCell.getCurrentJointTargetCellName(jointCell);
    let linkTargetDx = CanvasLinkCell.getCurrentJointTargetCellDx(jointCell);
    let linkTargetDy = CanvasLinkCell.getCurrentJointTargetCellDy(jointCell);

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

  static createCellNamePrefixForCanvasLinkCell( canvasIdName: string ): string {
    return canvasIdName + "." + CANVAS_LINK_CELL_NAME_COMMON_TAG;
  }

  // Initialize Joint Values
  static initializeJointLinkValues(
    cellId: number,
    cellName: string,
    cellLocalName: string,
    sourceCellName: string,
    sourceCellDx: number,
    sourceCellDy: number,
    targetCellName: string,
    targetCellDx: number,
    targetCellDy: number,
    jointCell: dia.Cell
  ): void {
    CanvasCell.initializeJointCellValues(
      cellId,
      cellName,
      cellLocalName,
      jointCell
    );
    JointModelValueAccessor.initializeValue(
      SOURCE_CELL_LOCAL_NAME_KEY,
      sourceCellName,
      jointCell
    );
    JointModelValueAccessor.initializeValue(
      SOURCE_CELL_DX_KEY,
      sourceCellDx,
      jointCell
    );
    JointModelValueAccessor.initializeValue(
      SOURCE_CELL_DY_KEY,
      sourceCellDy,
      jointCell
    );

    JointModelValueAccessor.initializeValue(
      TARGET_CELL_LOCAL_NAME_KEY,
      targetCellName,
      jointCell
    );
    JointModelValueAccessor.initializeValue(
      TARGET_CELL_DX_KEY,
      targetCellDx,
      jointCell
    );
    JointModelValueAccessor.initializeValue(
      TARGET_CELL_DY_KEY,
      targetCellDy,
      jointCell
    );
  }

  // Get Initial Joint Values
  static getInitialJointSourceCellName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getInitialValue(
      SOURCE_CELL_LOCAL_NAME_KEY,
      jointCell
    );
  }

  static getInitialJointSourceCellDx(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getInitialValue(
      SOURCE_CELL_DX_KEY,
      jointCell
    );
  }

  static getInitialJointSourceCellDy(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getInitialValue(
      SOURCE_CELL_DY_KEY,
      jointCell
    );
  }

  static getInitialJointTargetCellName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getInitialValue(
      TARGET_CELL_LOCAL_NAME_KEY,
      jointCell
    );
  }

  static getInitialJointTargetCellDx(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getInitialValue(
      TARGET_CELL_DX_KEY,
      jointCell
    );
  }

  static getInitialJointTargetCellDy(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getInitialValue(
      TARGET_CELL_DY_KEY,
      jointCell
    );
  }

  // Get Current Joint Values
  static getCurrentJointSourceCellName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getCurrentValue(
      SOURCE_CELL_LOCAL_NAME_KEY,
      jointCell
    );
  }

  static getCurrentJointSourceCellDx(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getCurrentValue(
      SOURCE_CELL_DX_KEY,
      jointCell
    );
  }

  static getCurrentJointSourceCellDy(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getCurrentValue(
      SOURCE_CELL_DY_KEY,
      jointCell
    );
  }

  static getCurrentJointTargetCellName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getCurrentValue(
      TARGET_CELL_LOCAL_NAME_KEY,
      jointCell
    );
  }

  static getCurrentJointTargetCellDx(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getCurrentValue(
      TARGET_CELL_DX_KEY,
      jointCell
    );
  }

  static getCurrentJointTargetCellDy(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getCurrentValue(
      TARGET_CELL_DY_KEY,
      jointCell
    );
  }

  // Set Joint Values
  static setJointSourceCellName( sourceCellName: string, jointCell: dia.Cell ): void {
    return JointModelValueAccessor.setCurrentValue(
      SOURCE_CELL_LOCAL_NAME_KEY,
      sourceCellName,
      jointCell
    );
  }

  static setJointSourceCellDx(sourceCellDx: number, jointCell: dia.Cell): void {
    return JointModelValueAccessor.setCurrentValue(
      SOURCE_CELL_DX_KEY,
      sourceCellDx,
      jointCell
    );
  }

  static setJointSourceCellDy(sourceCellDy: number, jointCell: dia.Cell): void {
    return JointModelValueAccessor.setCurrentValue(
      SOURCE_CELL_DY_KEY,
      sourceCellDy,
      jointCell
    );
  }

  static setJointTargetCellName( targetCellName: string, jointCell: dia.Cell ): void {
    return JointModelValueAccessor.setCurrentValue(
      TARGET_CELL_LOCAL_NAME_KEY,
      targetCellName,
      jointCell
    );
  }

  static setJointTargetCellDx(targetCellDx: number, jointCell: dia.Cell): void {
    return JointModelValueAccessor.setCurrentValue(
      TARGET_CELL_DX_KEY,
      targetCellDx,
      jointCell
    );
  }

  static setJointTargetCellDy(targetCellDy: number, jointCell: dia.Cell): void {
    return JointModelValueAccessor.setCurrentValue(
      TARGET_CELL_DY_KEY,
      targetCellDy,
      jointCell
    );
  }

}
