import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectNavOptionItemComponent } from './code-model-source-project-nav-option-item.component';

describe('CodeModelSourceProjectNavOptionItemComponent', () => {
  let component: CodeModelSourceProjectNavOptionItemComponent;
  let fixture: ComponentFixture<CodeModelSourceProjectNavOptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceProjectNavOptionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceProjectNavOptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
