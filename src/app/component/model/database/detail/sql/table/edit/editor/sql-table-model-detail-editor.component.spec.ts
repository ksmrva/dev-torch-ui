import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlTableModelDetailEditorComponent } from "./sql-table-model-detail-editor.component";

describe("SqlTableModelDetailEditorComponent", () => {
  let component: SqlTableModelDetailEditorComponent;
  let fixture: ComponentFixture<SqlTableModelDetailEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTableModelDetailEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlTableModelDetailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
