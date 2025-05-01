import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlDatabaseDetailEditFormComponent } from "./sql-database-detail-edit-form.component";

describe("SqlDatabaseDetailEditFormComponent", () => {
  let component: SqlDatabaseDetailEditFormComponent;
  let fixture: ComponentFixture<SqlDatabaseDetailEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDatabaseDetailEditFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlDatabaseDetailEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
