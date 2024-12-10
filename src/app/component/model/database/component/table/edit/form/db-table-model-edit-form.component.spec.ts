import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbTableModelEditFormComponent } from "./db-table-model-edit-form.component";

describe("DbTableModelEditFormComponent", () => {
  let component: DbTableModelEditFormComponent;
  let fixture: ComponentFixture<DbTableModelEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbTableModelEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbTableModelEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
