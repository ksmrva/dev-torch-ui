import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbModelEditFormComponent } from "./db-model-edit-form.component";

describe("DbModelEditFormComponent", () => {
  let component: DbModelEditFormComponent;
  let fixture: ComponentFixture<DbModelEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbModelEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
