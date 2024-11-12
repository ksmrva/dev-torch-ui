import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbModelSourceUrlEditFormComponent } from "./db-model-source-url-edit-form.component";

describe("DbModelSourceUrlCreateComponent", () => {
  let component: DbModelSourceUrlEditFormComponent;
  let fixture: ComponentFixture<DbModelSourceUrlEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelSourceUrlEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbModelSourceUrlEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
