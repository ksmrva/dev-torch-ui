import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasToolExplorerHeaderComponent } from "./canvas-tool-explorer-header.component";

describe("CanvasToolExplorerHeaderComponent", () => {
  let component: CanvasToolExplorerHeaderComponent;
  let fixture: ComponentFixture<CanvasToolExplorerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasToolExplorerHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasToolExplorerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
