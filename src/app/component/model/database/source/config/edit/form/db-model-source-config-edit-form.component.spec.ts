import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbModelSourceConfigEditFormComponent } from "./db-model-source-config-edit-form.component";

describe("DbModelSourceConfigCreateComponent", () => {
  let component: DbModelSourceConfigEditFormComponent;
  let fixture: ComponentFixture<DbModelSourceConfigEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelSourceConfigEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbModelSourceConfigEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
