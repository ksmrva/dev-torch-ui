import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbCategoryMatcherEditorComponent } from "./db-category-matcher-editor.component";

describe("DbCategoryMatcherEditorComponent", () => {
  let component: DbCategoryMatcherEditorComponent<any>;
  let fixture: ComponentFixture<DbCategoryMatcherEditorComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbCategoryMatcherEditorComponent<any>]
    }).compileComponents();

    fixture = TestBed.createComponent(DbCategoryMatcherEditorComponent<any>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
