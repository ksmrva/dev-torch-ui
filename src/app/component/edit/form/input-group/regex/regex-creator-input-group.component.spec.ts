import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegexCreatorInputGroupComponent } from "./regex-creator-input-group.component";

describe("RegexCreatorInputGroupComponent", () => {
  let component: RegexCreatorInputGroupComponent;
  let fixture: ComponentFixture<RegexCreatorInputGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegexCreatorInputGroupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegexCreatorInputGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
