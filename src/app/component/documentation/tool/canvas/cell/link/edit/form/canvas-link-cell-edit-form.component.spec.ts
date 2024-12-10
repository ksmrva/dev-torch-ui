import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasLinkCellEditFormComponent } from "./canvas-link-cell-edit-form.component";

describe("CanvasLinkCellEditFormComponent", () => {
  let component: CanvasLinkCellEditFormComponent;
  let fixture: ComponentFixture<CanvasLinkCellEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasLinkCellEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasLinkCellEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
