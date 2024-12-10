import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CanvasViewerComponent } from "../../../../canvas/viewer/canvas-viewer.component";

describe("CanvasViewerComponent", () => {
  let component: CanvasViewerComponent;
  let fixture: ComponentFixture<CanvasViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasViewerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
