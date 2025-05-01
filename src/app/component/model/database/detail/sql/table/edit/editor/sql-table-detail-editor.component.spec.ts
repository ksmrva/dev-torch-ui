import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlTableDetailEditorComponent } from "./sql-table-detail-editor.component";

describe("SqlTableDetailEditorComponent", () => {
  let component: SqlTableDetailEditorComponent;
  let fixture: ComponentFixture<SqlTableDetailEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTableDetailEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlTableDetailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
