import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbTableModelEditorComponent } from "./db-table-model-editor.component";

describe("DbTableModelEditorComponent", () => {
  let component: DbTableModelEditorComponent;
  let fixture: ComponentFixture<DbTableModelEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbTableModelEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbTableModelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
