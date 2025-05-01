import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeModelExplorerHeaderComponent } from './code-model-explorer-header.component';

describe('CodeModelExplorerHeaderComponent', () => {
  let component: CodeModelExplorerHeaderComponent;
  let fixture: ComponentFixture<CodeModelExplorerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelExplorerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelExplorerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
