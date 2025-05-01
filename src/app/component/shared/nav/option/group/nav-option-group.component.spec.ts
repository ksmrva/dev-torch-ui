import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavOptionGroupComponent } from './nav-option-group.component';

describe('NavOptionGroupComponent', () => {
  let component: NavOptionGroupComponent;
  let fixture: ComponentFixture<NavOptionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavOptionGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavOptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
