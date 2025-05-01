import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavOptionItemComponent } from './nav-option-item.component';

describe('NavOptionItemComponent', () => {
  let component: NavOptionItemComponent;
  let fixture: ComponentFixture<NavOptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavOptionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavOptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
