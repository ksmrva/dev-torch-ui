import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlTableDetailEditFormComponent } from "./sql-table-detail-edit-form.component";

describe("SqlTableDetailEditFormComponent", () => {
  let component: SqlTableDetailEditFormComponent;
  let fixture: ComponentFixture<SqlTableDetailEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTableDetailEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlTableDetailEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
