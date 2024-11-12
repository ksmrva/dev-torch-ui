import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import { CanvasCell } from "../../../../../../entity/canvas/cell/canvas-cell";
import { CanvasCustomCell } from "../../../../../../entity/canvas/cell/custom/canvas-custom-cell";
import { CanvasLinkCell } from "../../../../../../entity/canvas/cell/link/canvas-link-cell";
import { BaseComponent } from "../../../../../base.component";

@Component({
  selector: "canvas-link-cell-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./canvas-link-cell-edit-form.component.html",
  styleUrl: "./canvas-link-cell-edit-form.component.scss"
})
export class CanvasLinkCellEditFormComponent extends BaseComponent implements OnInit {

  @Input() linkCellToEditObservable: Observable<CanvasLinkCell | undefined>;

  @Input() allCanvasCellsBeingEditedObservable: Observable< CanvasCell[] | undefined >;

  @Output() linkCellWasUpdated: EventEmitter<boolean>;

  @Output() resetLinkCellEditButtonClicked: EventEmitter<boolean>;

  linkCellEditForm: FormGroup;

  linkCellToEdit: CanvasLinkCell | undefined;

  allCustomCells: CanvasCell[];

  constructor(
    formBuilder: FormBuilder
  ) {
    super();
    this.linkCellToEditObservable = of(undefined);
    this.allCanvasCellsBeingEditedObservable = of(undefined);
    this.linkCellWasUpdated = new EventEmitter<boolean>();
    this.resetLinkCellEditButtonClicked = new EventEmitter<boolean>();

    this.linkCellEditForm = formBuilder.group({
      name: new FormControl(""),
      sourceCellName: new FormControl(""),
      targetCellName: new FormControl(""),
      linkSourceDx: new FormControl(0),
      linkSourceDy: new FormControl(0),
      linkTargetDx: new FormControl(0),
      linkTargetDy: new FormControl(0)
    });

    this.linkCellToEdit = undefined;
    this.allCustomCells = [];
  }

  ngOnInit(): void {
    if (this.linkCellToEditObservable) {
      let linkCellToEditSubscription = this.linkCellToEditObservable.subscribe({
                                                                      next: (canvasLinkCell: CanvasLinkCell | undefined) => {
                                                                        if(canvasLinkCell) {
                                                                          this.setLinkCellForEdit(canvasLinkCell);
                                                                        }
                                                                      },
                                                                      error: (err: any) => {
                                                                        throw new Error( "Failed to load the Canvas Link Cell for editing due to [" + err + "]" );
                                                                      },
                                                                      complete: () => {
                                                                        console.log("Finished loading the Canvas Link Cell for editing");
                                                                      }
                                                                    });
      this.addLongLivingSubscription(linkCellToEditSubscription);
    }

    let allCanvasCellsBeingEditedSubscription =
      this.allCanvasCellsBeingEditedObservable.subscribe({
                                                    next: (allCanvasCells: CanvasCell[] | undefined) => {
                                                      if (allCanvasCells) {
                                                        this.allCustomCells = this.extractCanvasCustomCells(allCanvasCells);
                                                      }
                                                    },
                                                    error: (err: any) => {
                                                      throw new Error( "Failed to get the Canvas Cells being edited due to [" + err + "]" );
                                                    },
                                                    complete: () => {
                                                      console.log("Finished getting the Canvas Cells being edited");
                                                    }
                                                  });
    this.addLongLivingSubscription(allCanvasCellsBeingEditedSubscription);
  }

  extractCanvasCustomCells(allCanvasCells: CanvasCell[]): CanvasCustomCell[] {
    let canvasCustomCells: CanvasCustomCell[] = [];
    allCanvasCells.forEach((canvasCell: CanvasCell) => {
      if(canvasCell && canvasCell instanceof CanvasCustomCell) {
        canvasCustomCells.push(canvasCell);
      }
    });
    return canvasCustomCells;
  }

  saveLinkCell(): void {
    console.log("Saving Canvas Link Cell " + this.linkCellToEdit?.name);
    this.linkCellWasUpdated.emit(true);
  }

  isLinkCellNew(linkCell: CanvasLinkCell | undefined): boolean {
    let isLinkCellNew = false;
    if (linkCell && linkCell.isNewEntity()) {
      isLinkCellNew = true;
    }
    return isLinkCellNew;
  }

  resetLinkCellEdit(): void {
    this.resetLinkCellEditButtonClicked.emit(true);
  }

  private setLinkCellForEdit(linkCellForEdit: CanvasLinkCell) {
    this.linkCellEditForm.setValue({
      name: linkCellForEdit.localName,
      sourceCellName: linkCellForEdit.sourceCellLocalName,
      targetCellName: linkCellForEdit.targetCellLocalName,
      linkSourceDx: linkCellForEdit.linkSourceDx,
      linkSourceDy: linkCellForEdit.linkSourceDy,
      linkTargetDx: linkCellForEdit.linkTargetDx,
      linkTargetDy: linkCellForEdit.linkTargetDy
    });
    this.linkCellToEdit = linkCellForEdit;
  }
}
