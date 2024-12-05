import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectMenuComponent } from './code-model-source-project-menu.component';

describe('CodeModelSourceProjectMenuComponent', () => {
  let component: CodeModelSourceProjectMenuComponent;
  let fixture: ComponentFixture<CodeModelSourceProjectMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceProjectMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceProjectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
