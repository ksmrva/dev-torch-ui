import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasViewerHeaderComponent } from "./canvas-viewer-header.component";

describe("CanvasViewerHeaderComponent", () => {
  let component: CanvasViewerHeaderComponent;
  let fixture: ComponentFixture<CanvasViewerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasViewerHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasViewerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
