import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DbTableCategoryMatcherEditorComponent } from "./db-table-category-matcher-editor.component";

describe("DbTableCategoryMatcherEditorComponent", () => {
  let component: DbTableCategoryMatcherEditorComponent;
  let fixture: ComponentFixture<DbTableCategoryMatcherEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbTableCategoryMatcherEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbTableCategoryMatcherEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
