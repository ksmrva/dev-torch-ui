import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeModelSourceFileListEntryComponent } from './code-model-source-file-list-entry.component';

describe('CodeModelSourceFileExplorerEntryComponent', () => {
  let component: CodeModelSourceFileListEntryComponent;
  let fixture: ComponentFixture<CodeModelSourceFileListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceFileListEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceFileListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
