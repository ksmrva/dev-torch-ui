import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbModelSourceMenuComponent } from "./db-model-source-menu.component";

describe("DbModelSourceMenuComponent", () => {
  let component: DbModelSourceMenuComponent;
  let fixture: ComponentFixture<DbModelSourceMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelSourceMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbModelSourceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
