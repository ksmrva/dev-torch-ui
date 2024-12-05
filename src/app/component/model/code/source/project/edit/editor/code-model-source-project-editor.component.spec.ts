import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectEditorComponent } from './code-model-source-project-editor.component';

describe('CodeProjectEditorComponent', () => {
  let component: CodeModelSourceProjectEditorComponent;
  let fixture: ComponentFixture<CodeModelSourceProjectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceProjectEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceProjectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
