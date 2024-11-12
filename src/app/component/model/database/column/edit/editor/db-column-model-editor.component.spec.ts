import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbColumnModelEditorComponent } from "./db-column-model-editor.component";

describe("DbColumnModelEditorComponent", () => {
  let component: DbColumnModelEditorComponent;
  let fixture: ComponentFixture<DbColumnModelEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbColumnModelEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbColumnModelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
