import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbModelSourceEditorComponent } from "./db-model-source-editor.component";

describe("DbModelSourceCreateComponent", () => {
  let component: DbModelSourceEditorComponent;
  let fixture: ComponentFixture<DbModelSourceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelSourceEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbModelSourceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
