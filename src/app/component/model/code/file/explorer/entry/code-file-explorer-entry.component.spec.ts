import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeFileExplorerEntryComponent } from './code-file-explorer-entry.component';

describe('CodeFileExplorerEntryComponent', () => {
  let component: CodeFileExplorerEntryComponent;
  let fixture: ComponentFixture<CodeFileExplorerEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeFileExplorerEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeFileExplorerEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
