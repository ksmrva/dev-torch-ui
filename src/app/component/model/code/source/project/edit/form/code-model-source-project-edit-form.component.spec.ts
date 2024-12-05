import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectEditFormComponent } from './code-model-source-project-edit-form.component';

describe('CodeProjectEditFormComponent', () => {
  let component: CodeModelSourceProjectEditFormComponent;
  let fixture: ComponentFixture<CodeModelSourceProjectEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceProjectEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceProjectEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
