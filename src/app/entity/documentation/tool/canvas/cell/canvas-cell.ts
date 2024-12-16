import { dia } from "@joint/core";
import { ApiEntity } from "../../../../api-entity";
import { JointValueAccessor } from "../../../../misc/joint/value/joint-value-accessor";

export const CELL_ID_JOINT_KEY: string = "canvasCellId";
export const CELL_GLOBAL_NAME_JOINT_KEY: string = "canvasCellGlobalName";
export const CELL_LOCAL_NAME_JOINT_KEY: string = "canvasCellLocalName";
export const API_JSON_TYPE_KEY: string = "";

export abstract class CanvasCell extends ApiEntity {

  canvasId: number;

  globalName: string;

  localName: string;

  constructor() {
    super();

    this.canvasId = -1;
    this.globalName = "";
    this.localName = "";
  }

  initializeBaseValues( idInit: number, canvasIdInit: number, globalNameInit: string, localName: string ): CanvasCell {
    this.id = idInit;
    this.canvasId = canvasIdInit;
    this.globalName = globalNameInit;
    this.localName = localName;

    return this;
  }

  override deserialize(json: any): CanvasCell {
    super.deserialize(json);
    if (json) {
      this.canvasId = json.canvasId;
      this.globalName = json.globalName;
      this.localName = json.localName;
    }
    return this;
  }

  override isEqualTo(otherEntity: CanvasCell): boolean {
    let isEqualTo = super.isEqualTo(otherEntity);
    if (isEqualTo) {
      if(this.canvasId === otherEntity.canvasId
        && this.globalName === otherEntity.globalName
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
  static initializeJointCellValues( cellId: number, cellGlobalName: string, cellLocalName: string, jointCell: dia.Cell ): void {
    JointValueAccessor.initializeValue( CELL_ID_JOINT_KEY, cellId, jointCell );
    JointValueAccessor.initializeValue( CELL_GLOBAL_NAME_JOINT_KEY, cellGlobalName, jointCell );
    JointValueAccessor.initializeValue( CELL_LOCAL_NAME_JOINT_KEY, cellLocalName, jointCell );
  }

  // Get Initial Joint Values
  static getInitialJointCellId(jointCell: dia.Cell): number {
    return JointValueAccessor.getInitialValue( CELL_ID_JOINT_KEY, jointCell );
  }
  static getInitialJointCellGlobalName(jointCell: dia.Cell): string {
    return JointValueAccessor.getInitialValue( CELL_GLOBAL_NAME_JOINT_KEY, jointCell );
  }
  static getInitialJointCellLocalName(jointCell: dia.Cell): string {
    return JointValueAccessor.getInitialValue( CELL_LOCAL_NAME_JOINT_KEY, jointCell );
  }

  // Get Current Joint Values
  static getCurrentJointCellId(jointCell: dia.Cell): number {
    return JointValueAccessor.getCurrentValue( CELL_ID_JOINT_KEY, jointCell );
  }
  static getCurrentJointCellGlobalName(jointCell: dia.Cell): string {
    return JointValueAccessor.getCurrentValue( CELL_GLOBAL_NAME_JOINT_KEY, jointCell );
  }
  static getCurrentJointCellLocalName(jointCell: dia.Cell): string {
    return JointValueAccessor.getCurrentValue( CELL_LOCAL_NAME_JOINT_KEY, jointCell );
  }

  // Set Joint Values
  static setJointCellId(cellId: number, jointCell: dia.Cell): void {
    JointValueAccessor.setCurrentValue( CELL_ID_JOINT_KEY, cellId, jointCell );
  }
  static setJointCellGlobalName(cellGlobalName: string, jointCell: dia.Cell): void {
    JointValueAccessor.setCurrentValue( CELL_GLOBAL_NAME_JOINT_KEY, cellGlobalName, jointCell );
  }
  static setJointCellLocalName( cellLocalName: string, jointCell: dia.Cell ): void {
    JointValueAccessor.setCurrentValue( CELL_LOCAL_NAME_JOINT_KEY, cellLocalName, jointCell );
  }

}
