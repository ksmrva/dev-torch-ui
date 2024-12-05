import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CodeModelSourceFileViewerComponent } from "./code-model-source-file-viewer.component";

describe("CodeViewerComponent", () => {
  let component: CodeModelSourceFileViewerComponent;
  let fixture: ComponentFixture<CodeModelSourceFileViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceFileViewerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceFileViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
