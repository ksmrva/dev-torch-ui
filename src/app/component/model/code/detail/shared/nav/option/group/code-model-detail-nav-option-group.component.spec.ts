import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelDetailNavOptionGroupComponent } from './code-model-detail-nav-option-group.component';

describe('CodeModelDetailNavOptionGroupComponent', () => {
  let component: CodeModelDetailNavOptionGroupComponent;
  let fixture: ComponentFixture<CodeModelDetailNavOptionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelDetailNavOptionGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelDetailNavOptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
