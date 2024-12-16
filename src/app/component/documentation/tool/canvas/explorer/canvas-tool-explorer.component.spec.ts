import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasToolExplorerComponent } from "./canvas-tool-explorer.component";

describe("CanvasToolExplorerComponent", () => {
  let component: CanvasToolExplorerComponent;
  let fixture: ComponentFixture<CanvasToolExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasToolExplorerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasToolExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
