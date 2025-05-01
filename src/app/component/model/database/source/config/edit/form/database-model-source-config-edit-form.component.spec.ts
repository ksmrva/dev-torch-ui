import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatabaseModelSourceConfigEditFormComponent } from "./database-model-source-config-edit-form.component";

describe("DatabaseModelSourceConfigEditFormComponent", () => {
  let component: DatabaseModelSourceConfigEditFormComponent;
  let fixture: ComponentFixture<DatabaseModelSourceConfigEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelSourceConfigEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DatabaseModelSourceConfigEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
