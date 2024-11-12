import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, OnInit, OnDestroy, Input, Inject, ElementRef } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { DbColumnCategory } from "../../../../../../entity/model/database/column/category/db-column-category";
import { DbColumnModel } from "../../../../../../entity/model/database/column/db-column-model";
import { ModalService } from "../../../../../../service/modal/modal.service";
import { DbModelService } from "../../../../../../service/model/database/db-model.service";
import { ModalComponent } from "../../../../../modal/modal-component";
import { BaseComponent } from "../../../../../base.component";

@Component({
  selector: "db-column-edit-modal",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: "./db-column-edit-modal.component.html",
  styleUrl: "./db-column-edit-modal.component.scss"
})
export class DbColumnEditModalComponent extends BaseComponent implements OnInit, OnDestroy, ModalComponent<DbColumnModel> {

  @Input() id: string;

  @Input() columnModelToEdit: DbColumnModel | undefined;

  @Input() pageX: number;

  @Input() pageY: number;

  columnEditModalBodyForm: FormGroup;

  availableColumnCategories: DbColumnCategory[];

  isModalCurrentlyOpen: boolean;

  private element: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dbModelService: DbModelService,
    private modalService: ModalService<DbColumnModel>,
    formBuilder: FormBuilder,
    @Inject(ElementRef) el: ElementRef
  ) {
    super();

    this.id = "";
    this.columnModelToEdit = undefined;
    this.pageX = 0;
    this.pageY = 0;
    this.isModalCurrentlyOpen = false;
    this.availableColumnCategories = [];

    this.columnEditModalBodyForm = formBuilder.group({
      columnName: new FormControl(""),
      columnCategory: new FormControl(undefined)
    });

    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // Start the Modal in a closed state
    this.close();

    // Close modal on background click
    this.element.addEventListener("click", (el: any) => {
      if (el.target.id === "columnEditModalBackground") {
        this.close();
      }
    });

    // Add this instance to the Modal Service so it can be opened from any component
    this.modalService.add(this);

    // Move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // Get all Column Categories to allow updates
    let availableColumnCategoriesSubscription = this.dbModelService.getColumnCategories().subscribe({
                                                                                                  next: (columnCategories: DbColumnCategory[] | undefined) => {
                                                                                                    if (!columnCategories) {
                                                                                                      throw new Error("Failed to initialize the Column Categories");
                                                                                                    }
                                                                                                    this.availableColumnCategories = columnCategories;
                                                                                                  },
                                                                                                  error: (err: any) => {
                                                                                                    throw new Error( "Failed to initialize the Column Categories due to [" + err + "]" );
                                                                                                  },
                                                                                                  complete: () => {
                                                                                                    console.log("Finished initializing Column Categories");
                                                                                                  }
                                                                                                });
    this.addLongLivingSubscription(availableColumnCategoriesSubscription);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Remove this instancee from Modal Service
    this.modalService.remove(this);

    // Remove corresponding Element from HTML
    this.element.remove();
  }

  getId(): string {
    return this.id;
  }

  open( modalBodyPositionX: number, modalBodyPositionY: number, columnModelToEdit: DbColumnModel ): void {
    this.updateDisplayToShow();

    this.columnModelToEdit = columnModelToEdit;
    let modalBodyId = this.element.id + "Body";
    let columnEditModalBody = this.document.getElementById(modalBodyId);
    if (columnEditModalBody) {
      columnEditModalBody.style.left = modalBodyPositionX + "px";
      columnEditModalBody.style.top = modalBodyPositionY + "px";
    }
    let currentColumnCategory = this.availableColumnCategories.find((availableColumnCategory: DbColumnCategory) => {
        return availableColumnCategory.name === columnModelToEdit.columnCategory.name;
    });
    if (!currentColumnCategory) {
      currentColumnCategory = this.getUndefinedColumnCategory();
    }
    this.columnEditModalBodyForm.setValue({
      columnName: columnModelToEdit,
      columnCategory: currentColumnCategory
    });
    this.document.body.classList.add("modal-open");
    this.isModalCurrentlyOpen = true;
  }

  close(): void {
    this.updateDisplayToHide();
    this.columnModelToEdit = undefined;
    this.columnEditModalBodyForm.reset();
    this.document.body.classList.remove("modal-open");
    this.isModalCurrentlyOpen = false;
  }

  isOpen(): boolean {
    return this.isModalCurrentlyOpen;
  }

  saveColumnChanges(): void {
    console.log("Updating Column");
    this.close();
  }

  private updateDisplayToShow(): void {
    this.element.style.display = "block";
  }

  private updateDisplayToHide(): void {
    this.element.style.display = "none";
  }

  private getUndefinedColumnCategory(): DbColumnCategory | undefined {
    return this.availableColumnCategories.find((availableColumnCategory: DbColumnCategory) => {
      return DbColumnCategory.isNameEqualToUndefinedCategory( availableColumnCategory.name );
    });
  }

}
