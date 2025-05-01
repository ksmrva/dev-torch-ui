import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlColumnDetailEditFormComponent } from "./sql-column-detail-edit-form.component";

describe("SqlColumnDetailEditFormComponent", () => {
  let component: SqlColumnDetailEditFormComponent;
  let fixture: ComponentFixture<SqlColumnDetailEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlColumnDetailEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlColumnDetailEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
