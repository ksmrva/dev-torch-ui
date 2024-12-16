import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelSourceProjectExplorerComponent } from './code-model-source-project-explorer.component';

describe('CodeModelSourceProjectExplorerComponent', () => {
  let component: CodeModelSourceProjectExplorerComponent;
  let fixture: ComponentFixture<CodeModelSourceProjectExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceProjectExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceProjectExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
