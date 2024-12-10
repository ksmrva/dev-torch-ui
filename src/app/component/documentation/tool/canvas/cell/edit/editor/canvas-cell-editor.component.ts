import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable, BehaviorSubject, of } from "rxjs";
import { Canvas } from "../../../../../../../entity/documentation/tool/canvas/canvas";
import { CanvasCell } from "../../../../../../../entity/documentation/tool/canvas/cell/canvas-cell";
import { CanvasCustomCell } from "../../../../../../../entity/documentation/tool/canvas/cell/custom/canvas-custom-cell";
import { CanvasLinkCell } from "../../../../../../../entity/documentation/tool/canvas/cell/link/canvas-link-cell";
import { StringUtil } from "../../../../../../../entity/misc/string/util/string-util";
import { BaseComponent } from "../../../../../../base.component";
import { SimpleMenuSelectComponent } from "../../../../../../edit/menu/select/simple/simple-menu-select.component";
import { CanvasCustomCellEditFormComponent } from "../../custom/edit/form/canvas-custom-cell-edit-form.component";
import { CanvasLinkCellEditFormComponent } from "../../link/edit/form/canvas-link-cell-edit-form.component";

@Component({
  selector: "canvas-cell-editor",
  standalone: true,
  imports: [
    CommonModule,
    SimpleMenuSelectComponent,
    CanvasCustomCellEditFormComponent,
    CanvasLinkCellEditFormComponent
],
  templateUrl: "./canvas-cell-editor.component.html",
  styleUrl: "./canvas-cell-editor.component.scss"
})
export class CanvasCellEditorComponent extends BaseComponent implements OnInit {

  @Input() canvasForEditObservable: Observable< Canvas | undefined >;

  @Output() cellWasUpdated: EventEmitter<boolean>;

  cellNameSelectedForEdit: string | undefined;

  customCellForEdit$: BehaviorSubject<CanvasCustomCell | undefined>;

  linkCellForEdit$: BehaviorSubject<CanvasLinkCell | undefined>;

  allCanvasCells$: BehaviorSubject<CanvasCell[] | undefined>;

  canvasId: number;

  allCells: CanvasCell[];

  showCustomCellEditForm: boolean;

  showLinkCellEditForm: boolean;

  baseHtmlId: string;

  simpleMenuSelectBaseHtmlId: string;

  simpleMenuSelectLabelName: string;

  constructor() {
    super();
    this.canvasForEditObservable = of(undefined);
    this.cellWasUpdated = new EventEmitter<boolean>();

    this.cellNameSelectedForEdit = undefined;
    this.customCellForEdit$ = new BehaviorSubject<CanvasCustomCell | undefined>( undefined );
    this.linkCellForEdit$ = new BehaviorSubject<CanvasLinkCell | undefined>( undefined );
    this.allCanvasCells$ = new BehaviorSubject<CanvasCell[] | undefined>( undefined );
    this.canvasId = -1;
    this.allCells = [];
    this.showCustomCellEditForm = false;
    this.showLinkCellEditForm = false;
    this.baseHtmlId = "canvasCellEditor";
    this.simpleMenuSelectBaseHtmlId = this.baseHtmlId + "_CellSelect";
    this.simpleMenuSelectLabelName = "cells";
  }

  ngOnInit(): void {
    let canvasBeingEditedSubscription = this.canvasForEditObservable.subscribe({
                                                                              next: (nextCanvasBeingEdited: Canvas | undefined) => {
                                                                                this.setCanvasForEdit(nextCanvasBeingEdited);
                                                                              },
                                                                              error: (err: any) => {
                                                                                throw new Error( "Failed to load the Canvas for editing due to [" + err + "]" );
                                                                              },
                                                                              complete: () => {
                                                                                console.log("Finished updating the Canvas for editing");
                                                                              }
                                                                            });
    this.addLongLivingSubscription(canvasBeingEditedSubscription);
  }

  loadCellForEdit(cellNameSelected: string): void {
    if (StringUtil.isNotEmpty(cellNameSelected)) {
      this.cellNameSelectedForEdit = cellNameSelected;

      this.findAndSetCellForEdit();
    }
  }

  getAvailableCellKeys(): string[] {
    return this.allCells.map((cell: CanvasCell) => {
      return cell.localName;
    });
  }

  cellUpdated(): void {
    this.cellWasUpdated.emit(true);
  }

  resetEdit(): void {
    this.cellNameSelectedForEdit = undefined;
    this.resetBothCellsForEdit();
  }

  resetBothCellsForEdit(): void {
    this.customCellForEdit$.next(undefined);
    this.linkCellForEdit$.next(undefined);

    this.showCustomCellEditForm = false;
    this.showLinkCellEditForm = false;
  }

  resetAfterUpdate(): void {
    this.resetEdit();

    this.cellWasUpdated.emit(true);
  }

  private setCanvasForEdit( canvasForEdit: Canvas | undefined ): void {
    if (canvasForEdit) {
      this.canvasId = canvasForEdit.id;

      if (canvasForEdit.cells) {
        this.allCells = canvasForEdit.cells;
      } else {
        this.allCells = [];
      }
      this.allCanvasCells$.next(this.allCells);
      this.resetBothCellsForEdit();
    }
  }

  private findAndSetCellForEdit(): void {
    let cellForEdit = this.allCells.find((cell: CanvasCell) => {
      return cell.localName === this.cellNameSelectedForEdit;
    });
    if (!cellForEdit) {
      console.error( "Unable to find the Canvas Cell with name [" + this.cellNameSelectedForEdit + "]" );
    } else {
      if (cellForEdit instanceof CanvasCustomCell) {
        this.setCustomCellForEdit(cellForEdit);
      } else if (cellForEdit instanceof CanvasLinkCell) {
        this.setLinkCellForEdit(cellForEdit);
      } else {
        console.log("Unrecognized Canvas Cell type encountered, ignoring");
      }
    }
  }

  private setCustomCellForEdit( customCell: CanvasCustomCell | undefined ): void {
    if(customCell) {
      this.showCustomCellEditForm = true;
      this.showLinkCellEditForm = false;
    }
    this.customCellForEdit$.next(customCell);
  }

  private setLinkCellForEdit( linkCell: CanvasLinkCell | undefined ): void {
    if(linkCell) {
      this.showLinkCellEditForm = true;
      this.showCustomCellEditForm = false;
    }
    this.linkCellForEdit$.next(linkCell);
  }

}
