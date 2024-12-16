import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectEditModalComponent } from './code-model-source-project-edit-modal.component';

describe('CodeModelSourceProjectEditModalComponent', () => {
  let component: CodeModelSourceProjectEditModalComponent;
  let fixture: ComponentFixture<CodeModelSourceProjectEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceProjectEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceProjectEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
