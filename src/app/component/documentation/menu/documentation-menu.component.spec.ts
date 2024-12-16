import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentationMenuComponent } from './documentation-menu.component';

describe('DocumentationMenuComponent', () => {
  let component: DocumentationMenuComponent;
  let fixture: ComponentFixture<DocumentationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
