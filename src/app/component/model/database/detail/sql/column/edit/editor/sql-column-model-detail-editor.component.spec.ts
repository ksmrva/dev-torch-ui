import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlColumnModelDetailEditorComponent } from "./sql-column-model-detail-editor.component";

describe("SqlColumnModelDetailEditorComponent", () => {
  let component: SqlColumnModelDetailEditorComponent;
  let fixture: ComponentFixture<SqlColumnModelDetailEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlColumnModelDetailEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlColumnModelDetailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
