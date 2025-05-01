import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatabaseModelSourceUrlEditFormComponent } from "./database-model-source-url-edit-form.component";

describe("DatabaseModelSourceUrlEditFormComponent", () => {
  let component: DatabaseModelSourceUrlEditFormComponent;
  let fixture: ComponentFixture<DatabaseModelSourceUrlEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseModelSourceUrlEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DatabaseModelSourceUrlEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
