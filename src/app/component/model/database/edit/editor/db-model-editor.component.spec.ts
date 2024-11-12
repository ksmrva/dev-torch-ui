import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DbModelEditorComponent } from "./db-model-editor.component";

describe("DbModelEditorComponent", () => {
  let component: DbModelEditorComponent;
  let fixture: ComponentFixture<DbModelEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbModelEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DbModelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
