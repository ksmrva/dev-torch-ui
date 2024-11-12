export interface ModalComponent<T> {

  getId(): string;

  open(modalBodyPositionX: number, modalBodyPositionY: number, data: T): void;

  close(): void;

  isOpen(): boolean;

}
