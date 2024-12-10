import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Canvas } from "../../../../../../entity/documentation/tool/canvas/canvas";
import { StringUtil } from "../../../../../../entity/misc/string/util/string-util";
import { CanvasService } from "../../../../../../service/documentation/tool/canvas/canvas.service";
import { MenuSelectComponent } from "../../../../../edit/menu/select/menu-select.component";
import { ModalComponent } from "../../../../../modal/modal.component";
import { CanvasEditFormComponent } from "../form/canvas-edit-form.component";
import { BaseComponent } from "../../../../../base.component";


@Component({
  selector: 'canvas-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CanvasEditFormComponent,
    MenuSelectComponent,
    CanvasEditFormComponent,
    ModalComponent
],
  templateUrl: './canvas-edit-modal.component.html',
  styleUrl: './canvas-edit-modal.component.scss'
})
export class CanvasEditModalComponent extends BaseComponent implements OnInit {

  @Input() baseHtmlId: string;

  canvasForEdit$: BehaviorSubject<Canvas | undefined>;

  availableCanvasNames: string[];

  menuSelectBaseHtmlId: string;

  modalTitle: string;

  showSelect: boolean;

  constructor(
    private canvasService: CanvasService
  ) {
    super();

    this.canvasForEdit$ = new BehaviorSubject<Canvas | undefined>( undefined );
    this.availableCanvasNames = [];
    this.showSelect = true;
    this.baseHtmlId = "";
    this.menuSelectBaseHtmlId = "";
    this.modalTitle = "edit canvas";
  }

  ngOnInit(): void {
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";

    let availableCanvasNamesSubscription = this.canvasService.getAvailableCanvasNames().subscribe({
                                                                                            next: (canvasNames: string[] | undefined) => {
                                                                                              if (!canvasNames) {
                                                                                                throw new Error("Failed to get the available Canvas Names");
                                                                                              }
                                                                                              this.availableCanvasNames = canvasNames;
                                                                                            },
                                                                                            error: (err: any) => {
                                                                                              throw new Error( "Failed to load the available Canvas Names due to [" + err + "]" );
                                                                                            },
                                                                                            complete: () => {
                                                                                              console.log("Finished loading the available Canvas Names");
                                                                                            }
                                                                                          });
    this.addLongLivingSubscription(availableCanvasNamesSubscription);
  }

  loadNewCanvasForEdit(): void {
    this.setCanvasForEdit(new Canvas());
    this.showSelect = false;
  }

  loadCanvasForEdit(canvasNameSelected: string): void {
    if (StringUtil.isNotEmpty(canvasNameSelected)) {
      this.canvasService.getCanvas(canvasNameSelected).subscribe({
                                                            next: (loadedCanvas: Canvas | undefined) => {
                                                              if (!loadedCanvas) {
                                                                throw new Error( "Failed to load Canvas for editing using Name [" + canvasNameSelected + "]" );
                                                              }
                                                              this.setCanvasForEdit(loadedCanvas);
                                                            },
                                                            error: (err: any) => {
                                                              throw new Error( "Failed to load Canvas for editing using Name [" + canvasNameSelected + "] due to [" + err + "]" );
                                                            },
                                                            complete: () => {
                                                              console.log( "Finished loading the Canvas for editing using Name [" + canvasNameSelected + "]" );
                                                            }
                                                          });
    } else {
      console.error( "No Canvas Name was selected, unable to load for editing" );
    }
  }

  resetEdit(): void {
    this.setCanvasForEdit(undefined);
    this.showSelect = true;
  }

  private setCanvasForEdit(canvasForEdit: Canvas | undefined): void {
    this.canvasForEdit$.next(canvasForEdit);
    this.showSelect = false;
  }

}
