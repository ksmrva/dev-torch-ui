import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SqlTableCategoryMatcherEditorComponent } from "./sql-table-category-matcher-editor.component";

describe("SqlTableCategoryMatcherEditorComponent", () => {
  let component: SqlTableCategoryMatcherEditorComponent;
  let fixture: ComponentFixture<SqlTableCategoryMatcherEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTableCategoryMatcherEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqlTableCategoryMatcherEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
