import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasEditFormComponent } from "./canvas-edit-form.component";

describe("CanvasEditFormComponent", () => {
  let component: CanvasEditFormComponent;
  let fixture: ComponentFixture<CanvasEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
