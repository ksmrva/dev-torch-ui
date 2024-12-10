import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceFileViewerHeaderComponent } from './code-model-source-file-viewer-header.component';

describe('CodeModelSourceFileViewerHeaderComponent', () => {
  let component: CodeModelSourceFileViewerHeaderComponent;
  let fixture: ComponentFixture<CodeModelSourceFileViewerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceFileViewerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceFileViewerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
