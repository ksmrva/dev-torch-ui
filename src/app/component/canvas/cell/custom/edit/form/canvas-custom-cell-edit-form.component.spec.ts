import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasCustomCellEditFormComponent } from "./canvas-custom-cell-edit-form.component";

describe("CanvasCustomCellEditFormComponent", () => {
  let component: CanvasCustomCellEditFormComponent;
  let fixture: ComponentFixture<CanvasCustomCellEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasCustomCellEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasCustomCellEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
