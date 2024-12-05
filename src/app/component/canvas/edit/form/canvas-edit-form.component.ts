import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, of } from "rxjs";
import { Canvas } from "../../../../entity/canvas/canvas";
import { CanvasCell } from "../../../../entity/canvas/cell/canvas-cell";
import { CanvasCustomCell } from "../../../../entity/canvas/cell/custom/canvas-custom-cell";
import { CanvasLinkCell } from "../../../../entity/canvas/cell/link/canvas-link-cell";
import { CanvasService } from "../../../../service/canvas/canvas.service";
import { BaseComponent } from "../../../base.component";
import { CanvasCustomCellEditFormComponent } from "../../cell/custom/edit/form/canvas-custom-cell-edit-form.component";
import { CanvasCellEditorComponent } from "../../cell/edit/editor/canvas-cell-editor.component";
import { CanvasLinkCellEditFormComponent } from "../../cell/link/edit/form/canvas-link-cell-edit-form.component";

@Component({
  selector: "canvas-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CanvasCellEditorComponent
],
  templateUrl: "./canvas-edit-form.component.html",
  styleUrl: "./canvas-edit-form.component.scss"
})
export class CanvasEditFormComponent extends BaseComponent implements OnInit {

  @Input() canvasForEditObservable: Observable<Canvas | undefined>;

  @Output() canvasWasUpdated: EventEmitter<boolean>;

  @Output() resetEditButtonClicked: EventEmitter<boolean>;

  canvasEditForm: FormGroup;

  canvasForEdit: Canvas | undefined;

  canvasForEdit$: BehaviorSubject<Canvas | undefined>;

  canvasCellForEdit: CanvasCell | undefined;

  allCanvasCells$: BehaviorSubject<CanvasCell[] | undefined>;

  canvasCustomCells$: BehaviorSubject<CanvasCustomCell | undefined>;

  canvasLinkCells$: BehaviorSubject<CanvasLinkCell | undefined>;

  constructor(
    private canvasService: CanvasService,
    formBuilder: FormBuilder
  ) {
    super();
    this.canvasForEditObservable = of(undefined);
    this.canvasWasUpdated = new EventEmitter<boolean>();
    this.resetEditButtonClicked = new EventEmitter<boolean>();

    this.canvasEditForm = formBuilder.group({
      name: new FormControl("", Validators.required),
      height: new FormControl(0, Validators.required),
      width: new FormControl(0, Validators.required),
      backgroundColor: new FormControl("#FFFFFF", Validators.required)
    });

    this.canvasForEdit = undefined;
    this.canvasForEdit$ = new BehaviorSubject<Canvas | undefined>( undefined );
    this.canvasCellForEdit = undefined;
    this.allCanvasCells$ = new BehaviorSubject<CanvasCell[] | undefined>( undefined );
    this.canvasCustomCells$ = new BehaviorSubject< CanvasCustomCell | undefined >(undefined);
    this.canvasLinkCells$ = new BehaviorSubject< CanvasLinkCell | undefined >(undefined);
  }

  ngOnInit(): void {
    let canvasToEditSubscription = this.canvasForEditObservable.subscribe({
                                                                        next: (canvas: Canvas | undefined) => {
                                                                          this.setCanvasForEdit(canvas);
                                                                        },
                                                                        error: (err: any) => {
                                                                          throw new Error( "Failed to load the Canvas for editing due to [" + err + "]" );
                                                                        },
                                                                        complete: () => {
                                                                          console.log("Finished loading the Canvas for editing");
                                                                        }
                                                                      });
    this.addLongLivingSubscription(canvasToEditSubscription);
  }

  loadCanvasCellForEdit(event: any): void {
    if (event && event.target) {
      let canvasCellNameToLoad: string = event.target.value;
      if (this.canvasForEdit && canvasCellNameToLoad) {
        this.canvasCellForEdit = this.canvasForEdit.cells.find((canvasCell: CanvasCell) => {
          return canvasCell.localName === canvasCellNameToLoad;
        });
        if (!this.canvasCellForEdit) {
          console.error("Unable to find the Canvas Cell with name [" + canvasCellNameToLoad + "]");
        } else {
          if (this.canvasCellForEdit instanceof CanvasCustomCell) {
            this.setCanvasCustomCellForEdit(this.canvasCellForEdit);
          } else if (this.canvasCellForEdit instanceof CanvasLinkCell) {
            this.setCanvasLinkCellForEdit(this.canvasCellForEdit);
          } else {
            console.log("Unrecognized Canvas Cell type encountered, ignoring");
          }
        }
      }
    }
  }

  isCanvasCellForEditLoadedAndCustom(): boolean {
    let isCanvasCellForEditCustom: boolean = false;
    if (
      this.canvasCellForEdit
      && this.canvasCellForEdit instanceof CanvasCustomCell
    ) {
      isCanvasCellForEditCustom = true;
    }
    return isCanvasCellForEditCustom;
  }

  saveCanvas(): void {
    if (
      !this.canvasEditForm
      || !this.canvasEditForm.value
      || !this.canvasEditForm.valid
    ) {
      // TODO: handle error
    }
    if (this.canvasForEdit) {
      if (
        this.canvasForEdit.id !== null
        && this.canvasForEdit.id !== undefined
        && this.canvasForEdit.id >= 0
      ) {
        let canvasForUpdate = new Canvas();
        canvasForUpdate.id = this.canvasForEdit.id;
        canvasForUpdate.name = this.canvasEditForm.value.name;
        canvasForUpdate.height = this.canvasEditForm.value.height;
        canvasForUpdate.width = this.canvasEditForm.value.width;
        canvasForUpdate.backgroundColor = this.canvasEditForm.value.backgroundColor;

        // Don"t attempt to save any Cells with this call, they have their own form
        canvasForUpdate.cells = [];

        this.canvasService.updateCanvas(canvasForUpdate).subscribe({
                                                                  next: (updatedCanvas: Canvas | undefined) => {
                                                                    if (!updatedCanvas) {
                                                                      throw new Error("Failed to update the Canvas");
                                                                    }
                                                                    this.resetCanvasAfterSave();
                                                                  },
                                                                  error: (err: any) => {
                                                                    throw new Error("Failed to update the Canvas due to [" + err + "]");
                                                                  },
                                                                  complete: () => {
                                                                    console.log("Finished updating the Canvas");
                                                                  }
                                                                });


      } else {
        let canvasForCreate = new Canvas();
        canvasForCreate.id = -1;
        canvasForCreate.name = this.canvasEditForm.value.name;
        canvasForCreate.height = this.canvasEditForm.value.height;
        canvasForCreate.width = this.canvasEditForm.value.width;
        canvasForCreate.backgroundColor = this.canvasEditForm.value.backgroundColor;

        this.canvasService.createCanvas(canvasForCreate).subscribe({
                                                                    next: (createdCanvas: Canvas | undefined) => {
                                                                      if (createdCanvas) {
                                                                        this.resetCanvasAfterSave();
                                                                      } else {
                                                                        throw new Error("Failed to create the Canvas");
                                                                      }
                                                                    },
                                                                    error: (err: any) => {
                                                                      throw new Error( "Failed to create the Canvas due to [" + err + "]" );
                                                                    },
                                                                    complete: () => {
                                                                      console.log("Finished create the Canvas");
                                                                    }
                                                                  });
      }
    }
  }

  isCanvasNew(canvas: Canvas | undefined): boolean {
    let isCanvasNew = false;
    if (canvas && canvas.isNewEntity()) {
      isCanvasNew = true;
    }
    return isCanvasNew;
  }

  resetCanvasAfterSave(): void {
    this.resetEditForms();

    this.canvasWasUpdated.emit(true);
  }

  resetEdit(): void {
    this.resetEditForms();

    this.resetEditButtonClicked.emit(true);
  }

  resetEditForms(): void {
    this.resetBothCellsEdit();
    this.canvasEditForm.reset();
    this.canvasForEdit = undefined;
  }

  resetBothCellsEdit(): void {
    this.canvasCellForEdit = undefined;
    this.canvasCustomCells$.next(undefined);
    this.canvasLinkCells$.next(undefined);
  }

  private setCanvasForEdit(canvasForEdit: Canvas | undefined): void {
    if (canvasForEdit) {
      this.canvasEditForm.setValue({
        name: canvasForEdit.name,
        height: canvasForEdit.height,
        width: canvasForEdit.width,
        backgroundColor: canvasForEdit.backgroundColor,
      });
      this.canvasForEdit = canvasForEdit;

      let canvasCellsToEdit = this.canvasForEdit.cells;
      if (!canvasCellsToEdit) {
        canvasCellsToEdit = [];
      }
      this.setAllCanvasCellsForEdit(canvasCellsToEdit);
    }
  }

  private setAllCanvasCellsForEdit(canvasCellsForEdit: CanvasCell[]): void {
    this.allCanvasCells$.next(canvasCellsForEdit);
  }

  private setCanvasCustomCellForEdit(canvasCustomCellForEdit: CanvasCustomCell): void {
    this.canvasCustomCells$.next(canvasCustomCellForEdit);
  }

  private setCanvasLinkCellForEdit(canvasLinkCellForEdit: CanvasLinkCell): void {
    this.canvasLinkCells$.next(canvasLinkCellForEdit);
  }

}
