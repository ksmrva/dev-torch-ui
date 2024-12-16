import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlColumnCategoryMatcherEditorComponent } from "./sql-column-category-matcher-editor.component";

describe("SqlColumnCategoryMatcherEditorComponent", () => {
  let component: SqlColumnCategoryMatcherEditorComponent;
  let fixture: ComponentFixture<SqlColumnCategoryMatcherEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlColumnCategoryMatcherEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlColumnCategoryMatcherEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
