import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbColumnCategoryMatcherEditorComponent } from "./db-column-category-matcher-editor.component";

describe("DbColumnCategoryMatcherEditorComponent", () => {
  let component: DbColumnCategoryMatcherEditorComponent;
  let fixture: ComponentFixture<DbColumnCategoryMatcherEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbColumnCategoryMatcherEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbColumnCategoryMatcherEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
