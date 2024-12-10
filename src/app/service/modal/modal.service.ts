import { Injectable } from "@angular/core";
import { ModalComponent } from "../../component/modal/modal.component";

@Injectable({
  providedIn: "root"
})
export class ModalService {

  private modals: ModalComponent[];

  constructor() {
    this.modals = [];
  }

  add(modalToAdd: ModalComponent): void {
    let modelToAddId = modalToAdd.getId();
    let existingModalSearchResult = this.modals.find((existingModal: ModalComponent) => {
      return existingModal.getId() === modelToAddId;
    });
    if (!existingModalSearchResult) {
      this.modals.push(modalToAdd);
    } else {
      console.warn("Attempted to add Modal with ID [" + modelToAddId + "] but it was already added");
    }
  }

  remove(modalToRemove: ModalComponent): void {
    this.modals = this.modals.filter((modal: ModalComponent) => {
      return modal === modalToRemove;
    });
  }

  open(modalToOpenId: string): void {
    let modalToOpenResult = this.modals.find((modal: ModalComponent) => {
      return modal.getId() === modalToOpenId;
    });

    if (!modalToOpenResult) {
      throw new Error("Attempted to open Modal with ID [" + modalToOpenId + "], but it was not found in the active Modal list");
    }

    modalToOpenResult.open();
  }

  close(): void {
    let currentlyOpenModal = this.modals.find((modal: ModalComponent) => {
      return modal.isOpen();
    });
    if(currentlyOpenModal) {
      currentlyOpenModal.close();
    }
  }

}
