export class ObjectGrid<T> {

  objectsPerRow: number;

  grid: (T | null)[][];

  currentGridRow: (T | null)[];

  currentGridRowIndex: number;

  currentGridColumnIndex: number;

  constructor(objectsPerRowInit: number) {
    this.objectsPerRow = 3;
    this.grid = [];
    this.currentGridRow = [];
    this.currentGridRowIndex = 0;
    this.currentGridColumnIndex = 0;

    if (objectsPerRowInit > 0) {
      this.objectsPerRow = objectsPerRowInit;
    } else {
      // TODO: Warn
      console.log( "Attempted to instantiate an ObjectGrid with less than 0 Objects Per Row, defaulting to [" + this.objectsPerRow + "]" );
    }

    this.createNextGridRow();
  }

  add(object: T | null): void {
    if (this.currentGridRow.length === this.objectsPerRow) {
      this.createNextGridRow();
      this.currentGridRowIndex++;
    }
    this.currentGridRow.push(object);
    this.currentGridColumnIndex++;
  }

  fillUpRemainingRowWithBlankValues(): void {
    let previousRowIndex = this.currentGridRowIndex;
    let numberOfSpotsLeftInRow = this.objectsPerRow - this.currentGridRow.length;
    for (let i = 0; i < numberOfSpotsLeftInRow; i++) {
      this.add(null);
    }
  }

  private createNextGridRow(): void {
    this.currentGridRow = [];
    this.grid.push(this.currentGridRow);

    this.currentGridColumnIndex = 0;
  }

}
