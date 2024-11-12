import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbColumnModelEditFormComponent } from "./db-column-model-edit-form.component";

describe("DbColumnModelEditFormComponent", () => {
  let component: DbColumnModelEditFormComponent;
  let fixture: ComponentFixture<DbColumnModelEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbColumnModelEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbColumnModelEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
