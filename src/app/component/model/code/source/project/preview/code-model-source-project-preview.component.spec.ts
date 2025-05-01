import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectPreviewComponent } from './code-model-source-project-preview.component';

describe('CodeModelSourceProjectExplorerComponent', () => {
  let component: CodeModelSourceProjectPreviewComponent;
  let fixture: ComponentFixture<CodeModelSourceProjectPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceProjectPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceProjectPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
