import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelMenuComponent } from './model-menu.component';

describe('ModelMenuComponent', () => {
  let component: ModelMenuComponent;
  let fixture: ComponentFixture<ModelMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
