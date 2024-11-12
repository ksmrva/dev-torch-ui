import { Injectable } from "@angular/core";
import { ModalComponent } from "../../component/modal/modal-component";

@Injectable({
  providedIn: "root"
})
export class ModalService<T> {

  private modals: ModalComponent<T>[];

  constructor() {
    this.modals = [];
  }

  add(modal: ModalComponent<T>): void {
    // ensure component has a unique id attribute
    if (
      !modal.getId()
      || this.modals.find((x: ModalComponent<T>) => {
        return x.getId() === modal.getId();
      })
    ) {
      throw new Error("modal must have a unique id attribute");
    }

    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(modal: ModalComponent<T>): void {
    // remove modal from array of active modals
    this.modals = this.modals.filter((x: ModalComponent<T>) => {
      return x === modal;
    });
  }

  open(id: string, modalBodyPositionX: number, modalBodyPositionY: number, data: T): void {
    // open modal specified by id
    const modal = this.modals.find((x: ModalComponent<T>) => {
      return x.getId() === id;
    });

    if (!modal) {
      throw new Error("Modal '${id}' not found");
    }

    modal.open(modalBodyPositionX, modalBodyPositionY, data);
  }

  close(): void {
    // close the modal that is currently open
    const modal = this.modals.find((x: ModalComponent<T>) => {
      x.isOpen
    });
    modal?.close();
  }
}
