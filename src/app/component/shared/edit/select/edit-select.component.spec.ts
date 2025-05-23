import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditSelectComponent } from './edit-select.component';

describe('EditSelectComponent', () => {
  let component: EditSelectComponent;
  let fixture: ComponentFixture<EditSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
