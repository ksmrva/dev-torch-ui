import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeModelSourceFileExplorerEntryComponent } from './code-model-source-file-explorer-entry.component';

describe('CodeModelSourceFileExplorerEntryComponent', () => {
  let component: CodeModelSourceFileExplorerEntryComponent;
  let fixture: ComponentFixture<CodeModelSourceFileExplorerEntryComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceFileExplorerEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceFileExplorerEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
