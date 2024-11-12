import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbModelMenuComponent } from "./db-model-menu.component";

describe("DbModelMenuComponent", () => {
  let component: DbModelMenuComponent;
  let fixture: ComponentFixture<DbModelMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbModelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
