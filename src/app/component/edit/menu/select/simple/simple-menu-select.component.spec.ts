import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SimpleMenuSelectComponent } from "./simple-menu-select.component";

describe("SimpleMenuSelectComponent", () => {
  let component: SimpleMenuSelectComponent;
  let fixture: ComponentFixture<SimpleMenuSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleMenuSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleMenuSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
