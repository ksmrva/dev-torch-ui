import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlTableModelDetailEditFormComponent } from "./sql-table-model-detail-edit-form.component";

describe("SqlTableModelDetailEditFormComponent", () => {
  let component: SqlTableModelDetailEditFormComponent;
  let fixture: ComponentFixture<SqlTableModelDetailEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTableModelDetailEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlTableModelDetailEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
