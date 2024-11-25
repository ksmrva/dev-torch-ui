import { dia } from "@joint/core";
import { ApiEntity } from "../../api-entity";
import { JointModelValueAccessor } from "../../joint/model/joint-model-value-accessor";

export const CELL_ID_JOINT_KEY: string = "canvasCellId";
export const CELL_NAME_JOINT_KEY: string = "canvasCellName";
export const CELL_LOCAL_NAME_JOINT_KEY: string = "canvasCellLocalName";
export const API_JSON_TYPE_KEY: string = "";

export abstract class CanvasCell extends ApiEntity {

  canvasId: number;

  name: string;

  localName: string;

  constructor() {
    super();

    this.canvasId = -1;
    this.name = "";
    this.localName = "";
  }

  initializeBaseValues( idInit: number, canvasIdInit: number, nameInit: string, localName: string ): CanvasCell {
    this.id = idInit;
    this.canvasId = canvasIdInit;
    this.name = nameInit;
    this.localName = localName;

    return this;
  }

  override deserialize(json: any): CanvasCell {
    super.deserialize(json);
    if (json) {
      this.canvasId = json.canvasId;
      this.name = json.name;
      this.localName = json.localName;
    }
    return this;
  }

  override isEqualTo(otherEntity: CanvasCell): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.canvasId === otherEntity.canvasId
        && this.name === otherEntity.name
        && this.localName === otherEntity.localName
      ) {
        isEqualTo = true;
      } else {
        isEqualTo = false;
      }
    }
    return isEqualTo;
  }

  // TODO: See if this is redundant since we should have a database model
  static createDatabaseTableTag( databaseName: string, schemaName: string, tableName: string ): string {
    return databaseName + "." + schemaName + "." + tableName;
  }

  // Initialize Joint Values
  static initializeJointCellValues( cellId: number, cellName: string, cellLocalName: string, jointCell: dia.Cell ): void {
    JointModelValueAccessor.initializeValue( CELL_ID_JOINT_KEY, cellId, jointCell );
    JointModelValueAccessor.initializeValue( CELL_NAME_JOINT_KEY, cellName, jointCell );
    JointModelValueAccessor.initializeValue( CELL_LOCAL_NAME_JOINT_KEY, cellLocalName, jointCell );
  }

  // Get Initial Joint Values
  static getInitialJointCellId(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getInitialValue( CELL_ID_JOINT_KEY, jointCell );
  }
  static getInitialJointCellName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getInitialValue( CELL_NAME_JOINT_KEY, jointCell );
  }
  static getInitialJointCellLocalName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getInitialValue( CELL_LOCAL_NAME_JOINT_KEY, jointCell );
  }

  // Get Current Joint Values
  static getCurrentJointCellId(jointCell: dia.Cell): number {
    return JointModelValueAccessor.getCurrentValue( CELL_ID_JOINT_KEY, jointCell );
  }
  static getCurrentJointCellName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getCurrentValue( CELL_NAME_JOINT_KEY, jointCell );
  }
  static getCurrentJointCellLocalName(jointCell: dia.Cell): string {
    return JointModelValueAccessor.getCurrentValue( CELL_LOCAL_NAME_JOINT_KEY, jointCell );
  }

  // Set Joint Values
  static setJointCellId(cellId: number, jointCell: dia.Cell): void {
    JointModelValueAccessor.setCurrentValue( CELL_ID_JOINT_KEY, cellId, jointCell );
  }
  static setJointCellName(cellName: string, jointCell: dia.Cell): void {
    JointModelValueAccessor.setCurrentValue( CELL_NAME_JOINT_KEY, cellName, jointCell );
  }
  static setCurrentJointCellLocalName( cellLocalName: string, jointCell: dia.Cell ): void {
    JointModelValueAccessor.setCurrentValue( CELL_LOCAL_NAME_JOINT_KEY, cellLocalName, jointCell );
  }

}
