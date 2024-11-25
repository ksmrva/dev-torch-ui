import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeFileExplorerComponent } from './code-file-explorer.component';

describe('CodeFileExplorerComponent', () => {
  let component: CodeFileExplorerComponent;
  let fixture: ComponentFixture<CodeFileExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeFileExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeFileExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
