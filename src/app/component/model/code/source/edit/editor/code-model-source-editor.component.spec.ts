import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceEditorComponent } from './code-model-source-editor.component';

describe('CodeModelSourceEditorComponent', () => {
  let component: CodeModelSourceEditorComponent;
  let fixture: ComponentFixture<CodeModelSourceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
