import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlColumnDetailEditorComponent } from "./sql-column-detail-editor.component";

describe("SqlColumnDetailEditorComponent", () => {
  let component: SqlColumnDetailEditorComponent;
  let fixture: ComponentFixture<SqlColumnDetailEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlColumnDetailEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlColumnDetailEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
