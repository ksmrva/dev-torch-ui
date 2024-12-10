import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeModelSourceFileExplorerComponent } from './code-model-source-file-explorer.component';

describe('CodeModelSourceFileExplorerComponent', () => {
  let component: CodeModelSourceFileExplorerComponent;
  let fixture: ComponentFixture<CodeModelSourceFileExplorerComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeModelSourceFileExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeModelSourceFileExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
