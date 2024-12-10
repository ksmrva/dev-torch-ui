import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CanvasMenuComponent } from "./canvas-menu.component";

describe("CanvasMenuComponent", () => {
  let component: CanvasMenuComponent;
  let fixture: ComponentFixture<CanvasMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
