import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceMenuComponent } from './code-model-source-menu.component';

describe('CodeModelSourceMenuComponent', () => {
  let component: CodeModelSourceMenuComponent;
  let fixture: ComponentFixture<CodeModelSourceMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
