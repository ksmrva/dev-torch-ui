import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import { CanvasCustomCell } from "../../../../../../entity/canvas/cell/custom/canvas-custom-cell";
import { CanvasService } from "../../../../../../service/canvas/canvas.service";
import { BaseComponent } from "../../../../../base.component";

@Component({
  selector: "canvas-custom-cell-edit-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./canvas-custom-cell-edit-form.component.html",
  styleUrl: "./canvas-custom-cell-edit-form.component.scss"
})
export class CanvasCustomCellEditFormComponent extends BaseComponent implements OnInit {

  @Input() customCellToEditObservable: Observable< CanvasCustomCell | undefined >;

  @Output() customCellWasUpdated: EventEmitter<boolean>;

  @Output() resetCustomCellEditButtonClicked: EventEmitter<boolean>;

  customCellEditForm: FormGroup;

  customCellToEdit: CanvasCustomCell | undefined;

  constructor(
    formBuilder: FormBuilder,
    private canvasService: CanvasService,
  ) {
    super();
    this.customCellToEditObservable = of(undefined);
    this.customCellWasUpdated = new EventEmitter<boolean>();
    this.resetCustomCellEditButtonClicked = new EventEmitter<boolean>();

    this.customCellEditForm = formBuilder.group({
      name: new FormControl(""),
      html: new FormControl(""),
      height: new FormControl(0),
      width: new FormControl(0),
      canvasPositionX: new FormControl(0),
      canvasPositionY: new FormControl(0)
    });

    this.customCellToEdit = undefined;
  }

  ngOnInit(): void {
    let customCellToToEditSubscription =
      this.customCellToEditObservable.subscribe({
                                          next: (canvasCustomCell: CanvasCustomCell | undefined) => {
                                            if (canvasCustomCell) {
                                              this.setCustomCellForEdit(canvasCustomCell);
                                            }
                                          },
                                          error: (err: any) => {
                                            throw new Error( "Failed to load the Canvas Custom Cell for editing due to [" + err + "]" );
                                          },
                                          complete: () => {
                                            console.log( "Finished loading the Canvas Custom Cell for editing" );
                                          }
                                        });
    this.addLongLivingSubscription(customCellToToEditSubscription);
  }

  extractHtmlFromCanvasCellToEdit(): string {
    let canvasCellHtml = "";
    if (this.customCellToEdit) {
      canvasCellHtml = this.customCellToEdit.html;

      // TODO: Sanitize HTML
    }
    return canvasCellHtml;
  }

  saveCustomCell(): void {
    console.log("Saving Canvas Custom Cell " + this.customCellToEdit?.name);


    // this.canvasService.updateCanvas();
    this.customCellWasUpdated.emit(true);
  }

  isCustomCellNew(customCell: CanvasCustomCell | undefined): boolean {
    let isCustomCellNew = false;
    if (customCell && customCell.isNewEntity()) {
      isCustomCellNew = true;
    }
    return isCustomCellNew;
  }

  resetCustomCellEdit(): void {
    this.resetCustomCellEditButtonClicked.emit(true);
  }

  private setCustomCellForEdit( customCellForEdit: CanvasCustomCell ): void {
    this.customCellEditForm.setValue({
      name: customCellForEdit.localName,
      html: customCellForEdit.html,
      height: customCellForEdit.height,
      width: customCellForEdit.width,
      canvasPositionX: customCellForEdit.canvasPositionX,
      canvasPositionY: customCellForEdit.canvasPositionY
    });
    this.customCellToEdit = customCellForEdit;
  }

}
