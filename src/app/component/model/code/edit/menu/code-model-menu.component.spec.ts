import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelMenuComponent } from './code-model-menu.component';

describe('CodeModelMenuComponent', () => {
  let component: CodeModelMenuComponent;
  let fixture: ComponentFixture<CodeModelMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
