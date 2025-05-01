import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceNavOptionGroupComponent } from './code-model-source-nav-option-group.component';

describe('CodeModelSourceNavOptionBarComponent', () => {
  let component: CodeModelSourceNavOptionGroupComponent;
  let fixture: ComponentFixture<CodeModelSourceNavOptionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceNavOptionGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceNavOptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
