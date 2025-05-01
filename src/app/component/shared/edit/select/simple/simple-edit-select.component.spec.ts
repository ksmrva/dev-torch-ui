import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SimpleEditSelectComponent } from "./simple-edit-select.component";

describe("SimpleEditSelectComponent", () => {
  let component: SimpleEditSelectComponent;
  let fixture: ComponentFixture<SimpleEditSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleEditSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleEditSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
