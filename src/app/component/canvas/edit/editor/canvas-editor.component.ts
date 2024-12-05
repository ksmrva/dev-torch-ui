import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Canvas } from "../../../../entity/canvas/canvas";
import { StringUtil } from "../../../../entity/helper/string/util/string-util";
import { CanvasService } from "../../../../service/canvas/canvas.service";
import { BaseComponent } from "../../../base.component";
import { CanvasEditFormComponent } from "../form/canvas-edit-form.component";
import { MenuSelectComponent } from "../../../edit/menu/select/menu-select.component";

@Component({
  selector: "canvas-editor",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CanvasEditFormComponent,
    MenuSelectComponent
],
  templateUrl: "./canvas-editor.component.html",
  styleUrl: "./canvas-editor.component.scss"
})
export class CanvasEditorComponent extends BaseComponent implements OnInit {

  canvasForEdit$: BehaviorSubject<Canvas | undefined>;

  availableCanvasNames: string[];

  baseHtmlId: string;

  menuSelectBaseHtmlId: string;

  showSelect: boolean;

  constructor(
    private canvasService: CanvasService
  ) {
    super();
    this.canvasForEdit$ = new BehaviorSubject<Canvas | undefined>( undefined );
    this.availableCanvasNames = [];
    this.showSelect = true;
    this.baseHtmlId = "canvasEditor";
    this.menuSelectBaseHtmlId = this.baseHtmlId + "_Select";
  }

  ngOnInit(): void {
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
