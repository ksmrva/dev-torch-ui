import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlColumnModelDetailEditFormComponent } from "./sql-column-model-detail-edit-form.component";

describe("SqlColumnModelDetailEditFormComponent", () => {
  let component: SqlColumnModelDetailEditFormComponent;
  let fixture: ComponentFixture<SqlColumnModelDetailEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlColumnModelDetailEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlColumnModelDetailEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
