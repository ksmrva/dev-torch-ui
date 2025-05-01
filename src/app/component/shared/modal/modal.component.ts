import { Component, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ModalService } from '../../../service/shared/modal/modal.service';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() baseHtmlId: string;

  @Input() modalTitle: string;

  isModalCurrentlyOpen: boolean;

  element: any;

  constructor(
    private modalService: ModalService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(ElementRef) private el: ElementRef
  ) {
    super();

    this.baseHtmlId = "";
    this.modalTitle = "";
    this.isModalCurrentlyOpen = false;
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    this.close();

    // Close modal on background click
    this.element.addEventListener("click", (el: any) => {
      if (el.target.id === this.baseHtmlId + "_Background") {
        this.close();
      }
    });

    // Add this instance to the Modal Service so it can be opened from any component
    this.modalService.add(this);

    // Move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Remove this instancee from Modal Service
    this.modalService.remove(this);

    // Remove corresponding Element from HTML
    this.element.remove();
  }

  open(): void {
    this.updateDisplayToShow();

    let modalBodyId = this.baseHtmlId + "_Body";
    let columnEditModalBody = this.document.getElementById(modalBodyId);
    if (columnEditModalBody) {
      columnEditModalBody.style.left = "40%";
      columnEditModalBody.style.top = "20%";
    }

    this.document.body.classList.add("modal-open");
    this.isModalCurrentlyOpen = true;
  }

  close(): void {
    this.updateDisplayToHide();
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

  getModalId(): string {
    return this.baseHtmlId;
  }

  private updateDisplayToShow(): void {
    this.element.style.display = "block";
  }

  private updateDisplayToHide(): void {
    this.element.style.display = "none";
  }

}
