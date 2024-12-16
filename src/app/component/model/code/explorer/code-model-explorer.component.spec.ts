import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelExplorerComponent } from './code-model-explorer.component';

describe('CodeModelExplorerComponent', () => {
  let component: CodeModelExplorerComponent;
  let fixture: ComponentFixture<CodeModelExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
