import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasCellEditorComponent } from "./canvas-cell-editor.component";

describe("CanvasCellEditorComponent", () => {
  let component: CanvasCellEditorComponent;
  let fixture: ComponentFixture<CanvasCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasCellEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
